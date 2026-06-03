import type { Plugin, ViteDevServer } from "vite";
import { loadEnv } from "vite";
import {
  getClientIp,
  handleChatHealth,
  handleChatPost,
} from "./server/groq-chat-core";

function requestPath(url: string | undefined): string {
  if (!url) return "";
  return url.split("?")[0].replace(/\/$/, "") || "/";
}

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

function resolveApiKey(server: ViteDevServer, fallback?: string): string | undefined {
  const fromEnv = loadEnv(server.config.mode, server.config.root, "").GROQ_API_KEY;
  const key = (fromEnv || fallback || process.env.GROQ_API_KEY || "").trim();
  return key || undefined;
}

function attachChatMiddleware(server: ViteDevServer, fallbackKey?: string) {
  server.middlewares.use(async (req, res, next) => {
    const pathname = requestPath(req.url);
    if (!pathname.startsWith("/api/chat")) return next();

    const apiKey = resolveApiKey(server, fallbackKey);

    if (req.method === "GET" && pathname === "/api/chat/health") {
      const result = handleChatHealth(apiKey);
      sendJson(res, result.status, result.body);
      return;
    }

    if (req.method === "POST" && pathname === "/api/chat") {
      const ip = getClientIp(
        req.headers as Record<string, string | string[] | undefined>,
      );
      const raw = await readBody(req);
      const result = await handleChatPost(apiKey, ip, raw);
      sendJson(res, result.status, result.body);
      return;
    }

    sendJson(res, 405, { error: "Method not allowed" });
  });
}

export function groqChatPlugin(apiKey?: string): Plugin {
  return {
    name: "groq-chat-api",
    enforce: "pre",
    configureServer(server) {
      attachChatMiddleware(server, apiKey);
    },
    configurePreviewServer(server) {
      attachChatMiddleware(server, apiKey);
    },
  };
}
