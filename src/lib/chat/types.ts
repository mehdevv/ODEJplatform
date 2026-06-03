export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatApiResponse {
  message: string;
  offTopic?: boolean;
  error?: string;
}
