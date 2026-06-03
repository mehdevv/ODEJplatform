import { handleChatHealth } from "../_lib/groq-chat-core.js";

type Req = { method?: string };
type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

export default function handler(req: Req, res: Res) {
  try {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    const result = handleChatHealth(apiKey);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error("[api/chat/health]", err);
    return res.status(500).json({ ok: false, configured: false, error: "Health check failed" });
  }
}
