import type { ChatApiResponse, ChatMessage } from "./types";

export async function sendChatMessage(
  messages: Pick<ChatMessage, "role" | "content">[],
  locale: string,
): Promise<ChatApiResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, locale }),
  });

  const data = await parseJsonResponse<ChatApiResponse & { error?: string }>(res);

  if (!res.ok) {
    throw new Error(data.error ?? "Chat request failed");
  }

  return data;
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      res.status === 404
        ? "Chat API not found. Redeploy with api/ routes or restart npm run dev."
        : "Invalid response from chat API",
    );
  }
}

export type ChatHealthStatus = {
  ok: boolean;
  configured: boolean;
  /** Serverless function error (500) — redeploy needed, not just env var */
  unavailable?: boolean;
};

export async function checkChatHealth(): Promise<ChatHealthStatus> {
  try {
    const res = await fetch("/api/chat/health", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const data = await parseJsonResponse<{
      ok?: boolean;
      configured?: boolean;
    }>(res);
    if (!res.ok) {
      return {
        ok: false,
        configured: false,
        unavailable: res.status >= 500,
      };
    }
    return {
      ok: Boolean(data.ok),
      configured: Boolean(data.configured),
    };
  } catch {
    return { ok: false, configured: false, unavailable: true };
  }
}
