import type { ApiRequest, ApiResponse } from "../types";
import { handleChatHealth } from "../../server/groq-chat-core";

export default function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const result = handleChatHealth(apiKey);
  return res.status(result.status).json(result.body);
}
