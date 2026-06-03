import { useCallback, useEffect } from "react";
import { useBrowserLocation } from "wouter/use-browser-location";
import { setAppLanguage, getStoredLang } from "@/lib/i18n";
import type { AppLang } from "@/lib/languages";
import { isAppLang } from "@/lib/languages";

const LANG_PREFIX = /^\/(ar|fr|en|kab)(?=\/|$)/;

/** Path without locale prefix — used for route matching */
export function stripLocalePrefix(path: string): string {
  const m = path.match(LANG_PREFIX);
  if (!m) return path;
  const rest = path.slice(m[0].length);
  if (!rest || rest === "") return "/";
  return rest.startsWith("/") ? rest : `/${rest}`;
}

export function withLocalePrefix(path: string, lang: AppLang): string {
  const bare = stripLocalePrefix(path);
  if (
    bare.startsWith("/auth") ||
    bare.startsWith("/admin") ||
    bare.startsWith("/dashboard")
  ) {
    return bare;
  }
  return `/${lang}${bare === "/" ? "" : bare}`;
}

function shouldUseLocalePrefix(path: string): boolean {
  const bare = stripLocalePrefix(path);
  return (
    !bare.startsWith("/auth") &&
    !bare.startsWith("/admin") &&
    !bare.startsWith("/dashboard")
  );
}

/**
 * Wouter location hook: browser URL keeps /ar/, /fr/, /en/, /kab/; routes match without prefix.
 */
export function useLocaleLocation(): [
  string,
  (to: string, options?: { replace?: boolean }) => void,
] {
  const [fullPath, navigate] = useBrowserLocation();

  useEffect(() => {
    const langMatch = fullPath.match(LANG_PREFIX);
    if (langMatch && isAppLang(langMatch[1])) {
      setAppLanguage(langMatch[1]);
      return;
    }
    if (shouldUseLocalePrefix(fullPath)) {
      navigate(withLocalePrefix(fullPath, getStoredLang()), { replace: true });
    }
  }, [fullPath, navigate]);

  const stripped = stripLocalePrefix(fullPath);

  const setLocaleLocation = useCallback(
    (to: string, options?: { replace?: boolean }) => {
      const target = shouldUseLocalePrefix(to)
        ? withLocalePrefix(to, getStoredLang())
        : stripLocalePrefix(to);
      navigate(target, options);
    },
    [navigate],
  );

  return [stripped, setLocaleLocation];
}
