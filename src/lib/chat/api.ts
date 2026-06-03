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

  const data = (await res.json()) as ChatApiResponse & { error?: string };

  if (!res.ok) {
    throw new Error(data.error ?? "Chat request failed");
  }

  return data;
}

export async function checkChatHealth(): Promise<boolean> {
  try {
    const res = await fetch("/api/chat/health");
    const data = (await res.json()) as { configured?: boolean };
    return res.ok && Boolean(data.configured);
  } catch {
    return false;
  }
}
