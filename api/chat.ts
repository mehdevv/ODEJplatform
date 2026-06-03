import type { ApiRequest, ApiResponse } from "./types";
import { getClientIp, handleChatPost } from "../server/groq-chat-core";

export default async function handler(req: ApiRequest, res: ApiResponse) {
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
}
