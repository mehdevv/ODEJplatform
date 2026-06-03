import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { groqChatPlugin } from "./vite-plugin-groq-chat";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const groqApiKey = env.GROQ_API_KEY;

  return {
  base: "/",
  plugins: [react(), tailwindcss(), groqChatPlugin(groqApiKey)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
};
});
