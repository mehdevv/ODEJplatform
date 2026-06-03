import type { Plugin, ViteDevServer } from "vite";
import { ODEJ_KNOWLEDGE_BASE } from "./server/odej-knowledge";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.1-8b-instant";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 40;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function getClientIp(req: { headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0]?.trim() || "local";
  return "local";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

function buildSystemPrompt(locale: string): string {
  const langHint =
    locale === "fr"
      ? "Réponds en français."
      : locale === "en"
        ? "Reply in English."
        : locale === "kab"
          ? "Réponds en tamazight (latin) si possible, sinon en arabe."
          : "أجب بالعربية الفصحى البسيطة ما لم يطلب المستخدم لغة أخرى.";

  return `أنت مساعد رسمي لمنصة ديوان مؤسسات الشباب (ODEJ) ولاية بجاية.
${langHint}

القواعد الصارمة:
1. أجب فقط عن: ODEJ، المؤسسات الشبانية، الأنشطة، التكوين، التسجيل على المنصة، خلية الإصغاء بشكل عام، ديوان الشباب، الشراكات، وأسئلة الشباب المتعلقة بهذه الخدمات.
2. ارفض بأدب أي سؤال خارج هذا النطاق (واجبات مدرسية، سياسة، ترفيه عام، برمجة، إلخ).
3. لا تختلق أرقاماً أو تواريخاً أو عناوين غير موجودة في قاعدة المعرفة.
4. للحالات الصحية الحساسة: وجّه إلى /khilya أو الطوارئ، ولا تشخّص.
5. اذكر روابط الموقع عند الحاجة (مثل /formation، /activites، /contact، /auth).
6. كن مختصراً (3–6 جمل كحد أقصى ما لم يطلب المستخدم تفصيلاً).

قاعدة المعرفة الرسمية:
${ODEJ_KNOWLEDGE_BASE}`;
}

function isOffTopic(message: string): boolean {
  const lower = message.toLowerCase();
  const blocked = [
    "write me code",
    "اكتب لي كود",
    "homework",
    "واجب",
    "politics",
    "سياسة",
    "bitcoin",
    "recipe",
    "وصفة",
  ];
  if (blocked.some((b) => lower.includes(b))) return true;
  return false;
}

async function readBody(req: import("http").IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

function attachChatMiddleware(
  server: ViteDevServer,
  apiKey: string | undefined,
) {
  server.middlewares.use(async (req, res, next) => {
    if (!req.url?.startsWith("/api/chat")) return next();

    if (req.method === "GET" && req.url === "/api/chat/health") {
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          ok: true,
          configured: Boolean(apiKey),
          model: DEFAULT_MODEL,
        }),
      );
      return;
    }

    if (req.method !== "POST" || req.url !== "/api/chat") {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      res.statusCode = 429;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "تم تجاوز عدد الرسائل المسموح. حاول لاحقاً." }));
      return;
    }

    if (!apiKey) {
      res.statusCode = 503;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Chat API not configured. Set GROQ_API_KEY in .env.local",
        }),
      );
      return;
    }

    try {
      const raw = await readBody(req);
      const body = JSON.parse(raw) as {
        messages?: ChatMessage[];
        locale?: string;
      };

      const userMessages = (body.messages ?? []).filter((m) => m.role !== "system");
      const lastUser = [...userMessages].reverse().find((m) => m.role === "user");
      if (!lastUser?.content?.trim()) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Message required" }));
        return;
      }

      if (isOffTopic(lastUser.content)) {
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            message:
              "عذراً، أنا مساعد ODEJ وأجيب فقط عن منصة ديوان مؤسسات الشباب والخدمات الموجهة للشباب. يمكنك السؤال عن التسجيل، الأنشطة، التكوين، أو المؤسسات.",
            offTopic: true,
          }),
        );
        return;
      }

      const groqMessages: ChatMessage[] = [
        { role: "system", content: buildSystemPrompt(body.locale ?? "ar") },
        ...userMessages.slice(-8),
      ];

      const groqRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: DEFAULT_MODEL,
          messages: groqMessages,
          temperature: 0.3,
          max_tokens: 512,
        }),
      });

      if (!groqRes.ok) {
        const errText = await groqRes.text();
        console.error("[groq-chat]", groqRes.status, errText);
        res.statusCode = 502;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "خطأ في خدمة المساعد. حاول مجدداً." }));
        return;
      }

      const data = (await groqRes.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply =
        data.choices?.[0]?.message?.content?.trim() ||
        "لم أتمكن من إنشاء رد. جرّب صياغة سؤالك بشكل آخر أو تواصل معنا عبر /contact.";

      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: reply }));
    } catch (e) {
      console.error("[groq-chat]", e);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "خطأ داخلي" }));
    }
  });
}

export function groqChatPlugin(apiKey: string | undefined): Plugin {
  return {
    name: "groq-chat-api",
    configureServer(server) {
      attachChatMiddleware(server, apiKey);
    },
    configurePreviewServer(server) {
      attachChatMiddleware(server, apiKey);
    },
  };
}
