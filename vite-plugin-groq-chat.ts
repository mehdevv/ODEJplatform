import type { Plugin, ViteDevServer } from "vite";
import {
  getClientIp,
  handleChatHealth,
  handleChatPost,
} from "./server/groq-chat-core";

async function readBody(req: import("http").IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks).toString("utf8");
}

function sendJson(
  res: import("http").ServerResponse,
  status: number,
  body: Record<string, unknown>,
) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function attachChatMiddleware(
  server: ViteDevServer,
  apiKey: string | undefined,
) {
  server.middlewares.use(async (req, res, next) => {
    if (!req.url?.startsWith("/api/chat")) return next();

    if (req.method === "GET" && req.url === "/api/chat/health") {
      const result = handleChatHealth(apiKey);
      sendJson(res, result.status, result.body);
      return;
    }

    if (req.method !== "POST" || req.url !== "/api/chat") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    const ip = getClientIp(
      req.headers as Record<string, string | string[] | undefined>,
    );
    const raw = await readBody(req);
    const result = await handleChatPost(apiKey, ip, raw);
    sendJson(res, result.status, result.body);
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
