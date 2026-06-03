import { getStoredLang } from "@/lib/i18n";
import { isAppLang, type AppLang } from "@/lib/languages";

const LANG_PREFIX = /^\/(ar|fr|en|kab)(?=\/|$)/;

const NO_LOCALE_PREFIX =
  /^\/(auth|admin|dashboard|portal|club)(\/|$)/;

/** Path without locale prefix — used for route matching */
export function stripLocalePrefix(path: string): string {
  const normalized = path || "/";
  const m = normalized.match(LANG_PREFIX);
  if (!m) return normalized === "" ? "/" : normalized;
  const rest = normalized.slice(m[0].length);
  if (!rest || rest === "") return "/";
  return rest.startsWith("/") ? rest : `/${rest}`;
}

export function withLocalePrefix(path: string, lang: AppLang): string {
  const bare = stripLocalePrefix(path);
  if (NO_LOCALE_PREFIX.test(bare)) {
    return bare;
  }
  return `/${lang}${bare === "/" ? "" : bare}`;
}

export function shouldUseLocalePrefix(path: string): boolean {
  const bare = stripLocalePrefix(path);
  return !NO_LOCALE_PREFIX.test(bare);
}

function getAppBasePath(): string {
  const base = import.meta.env.BASE_URL ?? "/";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

/** Run before React mounts so refresh never flashes 404 on `/` or subpaths */
export function ensureLocaleUrlOnBoot(): void {
  if (typeof window === "undefined") return;

  const base = getAppBasePath();
  let pathname = window.location.pathname;
  if (base && pathname.startsWith(base)) {
    pathname = pathname.slice(base.length) || "/";
  }

  const langMatch = pathname.match(LANG_PREFIX);
  if (langMatch && isAppLang(langMatch[1])) {
    return;
  }

  if (!shouldUseLocalePrefix(pathname)) {
    return;
  }

  const targetPath = withLocalePrefix(pathname, getStoredLang());
  const nextPathname = `${base}${targetPath}`.replace(/\/{2,}/g, "/") || "/";
  const nextUrl = `${nextPathname}${window.location.search}${window.location.hash}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (currentUrl !== nextUrl) {
    window.history.replaceState(null, "", nextUrl);
  }
}
