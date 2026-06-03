import { ODEJ_KNOWLEDGE_BASE } from "./odej-knowledge.js";

export const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
export const DEFAULT_MODEL = "llama-3.1-8b-instant";

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export type ChatHandlerResult = {
  status: number;
  body: Record<string, unknown>;
};

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 40;
const RATE_WINDOW_MS = 60 * 60 * 1000;

export function getClientIp(
  headers: Record<string, string | string[] | undefined>,
): string {
  const forwarded = headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).split(",")[0]?.trim() || "unknown";
  }
  return "unknown";
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

  return `أنت مساعد رسمي لمنصة ODEJ (ديوان مؤسسات الشباب).
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
  return blocked.some((b) => lower.includes(b));
}

export function handleChatHealth(apiKey?: string): ChatHandlerResult {
  return {
    status: 200,
    body: {
      ok: true,
      configured: Boolean(apiKey?.trim()),
      model: DEFAULT_MODEL,
    },
  };
}

export async function handleChatPost(
  apiKey: string | undefined,
  ip: string,
  rawBody: string,
): Promise<ChatHandlerResult> {
  const key = apiKey?.trim();
  if (!checkRateLimit(ip)) {
    return {
      status: 429,
      body: { error: "تم تجاوز عدد الرسائل المسموح. حاول لاحقاً." },
    };
  }

  if (!key) {
    return {
      status: 503,
      body: {
        error:
          "Chat API not configured. Add GROQ_API_KEY in Vercel project settings and redeploy.",
      },
    };
  }

  try {
    const body = JSON.parse(rawBody) as {
      messages?: ChatMessage[];
      locale?: string;
    };

    const userMessages = (body.messages ?? []).filter((m) => m.role !== "system");
    const lastUser = [...userMessages].reverse().find((m) => m.role === "user");
    if (!lastUser?.content?.trim()) {
      return { status: 400, body: { error: "Message required" } };
    }

    if (isOffTopic(lastUser.content)) {
      return {
        status: 200,
        body: {
          message:
            "عذراً، أنا مساعد ODEJ وأجيب فقط عن منصة ديوان مؤسسات الشباب والخدمات الموجهة للشباب. يمكنك السؤال عن التسجيل، الأنشطة، التكوين، أو المؤسسات.",
          offTopic: true,
        },
      };
    }

    const groqMessages: ChatMessage[] = [
      { role: "system", content: buildSystemPrompt(body.locale ?? "ar") },
      ...userMessages.slice(-8),
    ];

    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
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
      return {
        status: 502,
        body: { error: "خطأ في خدمة المساعد. حاول مجدداً." },
      };
    }

    const data = (await groqRes.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply =
      data.choices?.[0]?.message?.content?.trim() ||
      "لم أتمكن من إنشاء رد. جرّب صياغة سؤالك بشكل آخر أو تواصل معنا عبر /contact.";

    return { status: 200, body: { message: reply } };
  } catch (e) {
    console.error("[groq-chat]", e);
    return { status: 500, body: { error: "خطأ داخلي" } };
  }
}
