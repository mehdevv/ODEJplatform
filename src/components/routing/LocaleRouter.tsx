import { useCallback, useEffect } from "react";
import { useBrowserLocation } from "wouter/use-browser-location";
import { setAppLanguage } from "@/lib/i18n";
import { isAppLang } from "@/lib/languages";
import {
  stripLocalePrefix,
  withLocalePrefix,
  shouldUseLocalePrefix,
} from "@/lib/locale-url";
import { getStoredLang } from "@/lib/i18n";

const LANG_PREFIX = /^\/(ar|fr|en|kab)(?=\/|$)/;

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
      const bare = stripLocalePrefix(to);
      const target = shouldUseLocalePrefix(bare)
        ? withLocalePrefix(bare, getStoredLang())
        : bare;
      navigate(target, options);
    },
    [navigate],
  );

  return [stripped, setLocaleLocation];
}

export { stripLocalePrefix, withLocalePrefix } from "@/lib/locale-url";
