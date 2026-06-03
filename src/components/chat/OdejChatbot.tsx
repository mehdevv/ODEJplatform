import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { MessageCircle, X, Send, Loader2, Bot, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { sendChatMessage, checkChatHealth } from "@/lib/chat/api";
import type { ChatMessage } from "@/lib/chat/types";
import {
  clearChatPersisted,
  loadChatPersisted,
  saveChatPersisted,
} from "@/lib/chat/storage";
import { ODEJ_LOGO_SRC } from "@/lib/branding";
import { isAppLang, getTextDirection } from "@/lib/languages";
import { easeOut } from "@/lib/motion";
import { Link } from "wouter";

function newMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

const SUGGESTIONS = [
  "chat.suggest1",
  "chat.suggest2",
  "chat.suggest3",
] as const;

function panelMotionOrigin(isRtl: boolean) {
  return isRtl ? "bottom right" : "bottom left";
}

const panelMotion = (isRtl: boolean) => ({
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.94,
    transformOrigin: panelMotionOrigin(isRtl),
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 32 },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.96,
    transition: { duration: 0.22, ease: easeOut },
  },
});

const launcherMotion = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 26 },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: { duration: 0.18 },
  },
} as const;

function ChatBubble({
  message,
  reduced,
  isRtl,
}: {
  message: ChatMessage;
  reduced: boolean | null;
  isRtl: boolean;
}) {
  const isUser = message.role === "user";
  const slideX = isUser ? (isRtl ? -16 : 16) : isRtl ? 16 : -16;
  const bubbleClass = cn(
    "max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap text-start",
    isUser
      ? "bg-primary text-primary-foreground rounded-be-md"
      : "bg-muted text-foreground rounded-bs-md",
  );

  if (reduced) {
    return (
      <div
        className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}
      >
        {!isUser && (
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Bot className="h-4 w-4 text-primary" />
          </div>
        )}
        <div className={bubbleClass} dir="auto">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, x: slideX }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.38, ease: easeOut }}
      className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 400, damping: 22 }}
          className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"
        >
          <Bot className="h-4 w-4 text-primary" />
        </motion.div>
      )}
      <motion.div layout className={bubbleClass} dir="auto">
        {message.content}
      </motion.div>
    </motion.div>
  );
}

export function OdejChatbot() {
  const { t, i18n } = useTranslation();
  const reduced = useReducedMotion();
  const lang = isAppLang(i18n.language) ? i18n.language : "ar";
  const isRtl = getTextDirection(lang) === "rtl";
  const panelVariants = panelMotion(isRtl);
  const [open, setOpen] = useState(false);
  const [health, setHealth] = useState<{
    configured: boolean;
    unavailable?: boolean;
  } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const stored = loadChatPersisted();
    if (stored?.messages.length) return stored.messages;
    return [];
  });
  const [input, setInput] = useState(() => loadChatPersisted()?.draft ?? "");
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = loadChatPersisted();
    if (stored?.messages.length) {
      setMessages(stored.messages);
      setInput(stored.draft);
    } else if (messages.length === 0) {
      setMessages([newMessage("assistant", t("chat.welcome"))]);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount
  }, []);

  const refreshHealth = useCallback(() => {
    checkChatHealth().then((status) =>
      setHealth({
        configured: status.configured,
        unavailable: status.unavailable,
      }),
    );
  }, []);

  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  useEffect(() => {
    if (open) refreshHealth();
  }, [open, refreshHealth]);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveChatPersisted({ messages, draft: input });
    }, 200);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [messages, input, hydrated]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, loading]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const clearConversation = useCallback(() => {
    clearChatPersisted();
    setMessages([newMessage("assistant", t("chat.welcome"))]);
    setInput("");
  }, [t]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg = newMessage("user", trimmed);
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        const history = nextMessages.map(({ role, content }) => ({ role, content }));
        const res = await sendChatMessage(history, i18n.language);
        setMessages((prev) => [...prev, newMessage("assistant", res.message)]);
      } catch (error: unknown) {
        const errText =
          error instanceof Error ? error.message : t("chat.errorGeneric");
        setMessages((prev) => [
          ...prev,
          newMessage("assistant", t("chat.errorReply", { detail: errText })),
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, i18n.language, t],
  );

  const showSuggestions =
    messages.filter((m) => m.role === "user").length === 0;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            key="launcher"
            className={cn(
              "fixed bottom-6 z-[61] md:bottom-8",
              isRtl ? "end-6 md:end-8" : "start-6 md:start-8",
            )}
            variants={reduced ? undefined : launcherMotion}
            initial={reduced ? false : "hidden"}
            animate={reduced ? undefined : "visible"}
            exit={reduced ? undefined : "exit"}
          >
            <Button
              type="button"
              size="lg"
              className={cn(
                "h-14 w-14 rounded-full shadow-lg odej-chat-launcher",
                !reduced && "transition-transform hover:scale-105 active:scale-95",
              )}
              onClick={() => setOpen(true)}
              aria-label={t("chat.open")}
            >
              <MessageCircle className="h-6 w-6 relative z-10" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-open"
            className="fixed inset-0 z-[59] pointer-events-none"
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOut }}
          >
            <button
              type="button"
              aria-label={t("chat.close")}
              className="absolute inset-0 pointer-events-auto cursor-default bg-black/20 backdrop-blur-[1px] border-0 p-0"
              onMouseDown={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={t("chat.title")}
              dir={isRtl ? "rtl" : "ltr"}
              className={cn(
                "pointer-events-auto fixed flex flex-col bg-background border shadow-2xl overflow-hidden",
                "inset-x-3 bottom-3 top-auto h-[min(520px,75dvh)] rounded-2xl",
                "md:inset-auto md:bottom-8 md:w-[400px] md:h-[560px]",
                isRtl ? "md:end-8 md:start-auto" : "md:start-8 md:end-auto",
              )}
              variants={reduced ? undefined : panelVariants}
              initial={reduced ? false : "hidden"}
              animate={reduced ? undefined : "visible"}
              exit={reduced ? undefined : "exit"}
              onMouseDown={(e) => e.stopPropagation()}
            >
            <motion.header
              initial={reduced ? false : { opacity: 0, y: -8 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.06, duration: 0.3, ease: easeOut }}
              className="flex items-center gap-3 px-4 py-3 border-b bg-primary text-primary-foreground rounded-t-2xl shrink-0"
            >
              <img
                src={ODEJ_LOGO_SRC}
                alt=""
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/30 bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{t("chat.title")}</p>
                <p className="text-xs text-primary-foreground/80 truncate">
                  {t("chat.subtitle")}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-white/10 shrink-0"
                onClick={clearConversation}
                aria-label={t("chat.clear")}
                title={t("chat.clear")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-white/10 shrink-0"
                onClick={() => setOpen(false)}
                aria-label={t("chat.close")}
              >
                <X className="h-5 w-5" />
              </Button>
            </motion.header>

            {health && !health.configured && (
              <p className="text-xs bg-amber-50 text-amber-900 px-4 py-2 border-b">
                {t(health.unavailable ? "chat.apiUnavailable" : "chat.notConfigured")}
              </p>
            )}

            <ScrollArea className="flex-1 px-3 py-3">
              <motion.div
                className="space-y-3"
                layout={!reduced}
              >
                {messages.map((m) => (
                  <ChatBubble
                    key={m.id}
                    message={m}
                    reduced={reduced}
                    isRtl={isRtl}
                  />
                ))}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 justify-start text-muted-foreground text-sm"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="inline-flex gap-0.5">
                        {t("chat.thinking")}
                        {!reduced && (
                          <motion.span
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            …
                          </motion.span>
                        )}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </motion.div>
            </ScrollArea>

            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: easeOut }}
                  className="px-3 pb-2 flex flex-wrap gap-2 shrink-0 overflow-hidden"
                >
                  {SUGGESTIONS.map((key, i) => (
                    <motion.button
                      key={key}
                      type="button"
                      initial={reduced ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduced ? 0 : 0.12 + i * 0.06,
                        duration: 0.32,
                        ease: easeOut,
                      }}
                      whileHover={reduced ? undefined : { scale: 1.03, y: -1 }}
                      whileTap={reduced ? undefined : { scale: 0.98 }}
                      className="text-xs px-2.5 py-1 rounded-full border bg-muted/50 hover:bg-muted transition-colors"
                      onClick={() => send(t(key))}
                    >
                      {t(key)}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.footer
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.32, ease: easeOut }}
              className="p-3 border-t space-y-2 shrink-0"
            >
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
              >
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t("chat.placeholder")}
                  rows={2}
                  dir={isRtl ? "rtl" : "ltr"}
                  className="min-h-[44px] max-h-24 resize-none text-sm text-start"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  disabled={loading || configured === false}
                />
                <motion.div
                  whileHover={reduced ? undefined : { scale: 1.05 }}
                  whileTap={reduced ? undefined : { scale: 0.92 }}
                >
                  <Button
                    type="submit"
                    size="icon"
                    className="shrink-0 h-11 w-11"
                    disabled={loading || !input.trim() || configured === false}
                  >
                    <Send className={cn("h-4 w-4", isRtl && "-scale-x-100")} />
                  </Button>
                </motion.div>
              </form>
              <p className="text-[10px] text-muted-foreground text-center leading-snug text-pretty">
                {t("chat.disclaimer")}{" "}
                <Link href="/khilya" className="text-primary underline">
                  {t("nav.khilya")}
                </Link>
                {" · "}
                <Link href="/contact" className="text-primary underline">
                  {t("nav.contact")}
                </Link>
              </p>
            </motion.footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
