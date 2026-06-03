import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n";
import { ensureLocaleUrlOnBoot } from "@/lib/locale-url";

ensureLocaleUrlOnBoot();

createRoot(document.getElementById("root")!).render(<App />);
