import type { ChatMessage } from "@/lib/chat/types";

const STORAGE_KEY = "odej_chat_v1";
const MAX_MESSAGES = 80;

export interface ChatPersisted {
  messages: ChatMessage[];
  draft: string;
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const m = value as ChatMessage;
  return (
    typeof m.id === "string" &&
    (m.role === "user" || m.role === "assistant") &&
    typeof m.content === "string" &&
    typeof m.createdAt === "string"
  );
}

export function loadChatPersisted(): ChatPersisted | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const { messages, draft } = parsed as ChatPersisted;
    if (!Array.isArray(messages)) return null;
    const valid = messages.filter(isChatMessage).slice(-MAX_MESSAGES);
    if (valid.length === 0) return null;
    return {
      messages: valid,
      draft: typeof draft === "string" ? draft : "",
    };
  } catch {
    return null;
  }
}

export function saveChatPersisted(data: ChatPersisted): void {
  if (typeof window === "undefined") return;
  try {
    const payload: ChatPersisted = {
      messages: data.messages.slice(-MAX_MESSAGES),
      draft: data.draft,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota or private mode */
  }
}

export function clearChatPersisted(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
