import { getClientIp, handleChatPost } from "../_lib/groq-chat-core.js";

type Req = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};

type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
};

export default async function handler(req: Req, res: Res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const ip = getClientIp(req.headers);
    const rawBody =
      typeof req.body === "string"
        ? req.body
        : req.body
          ? JSON.stringify(req.body)
          : "";

    const result = await handleChatPost(apiKey, ip, rawBody);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error("[api/chat]", err);
    return res.status(500).json({ error: "Chat function failed", ok: false });
  }
}
