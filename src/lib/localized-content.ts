import { useTranslation } from "react-i18next";
import type { AppLang } from "@/lib/languages";
import { isAppLang } from "@/lib/languages";

type LocalizedFields = Record<string, string | undefined>;

/** Pick a localized string from entity fields (title, titleAr, titleFr, titleEn, titleKab, …) */
export function pickLocalized(
  entity: LocalizedFields,
  baseKey: string,
  lang: AppLang,
): string {
  const primary = entity[baseKey];
  const ar = entity[`${baseKey}Ar`] ?? primary;
  const fr = entity[`${baseKey}Fr`] ?? entity.name ?? primary;
  const en = entity[`${baseKey}En`] ?? fr ?? primary;
  const kab = entity[`${baseKey}Kab`] ?? fr ?? primary;

  switch (lang) {
    case "ar":
      return ar ?? primary ?? "";
    case "fr":
      return fr ?? en ?? ar ?? "";
    case "en":
      return en ?? fr ?? ar ?? "";
    case "kab":
      return kab ?? fr ?? en ?? "";
    default:
      return primary ?? "";
  }
}

export function useLocalized() {
  const { i18n } = useTranslation();
  const lang: AppLang = isAppLang(i18n.language) ? i18n.language : "ar";

  const dateLocale =
    lang === "ar" ? "ar-DZ" : lang === "fr" ? "fr-DZ" : "en-GB";

  return {
    lang,
    dateLocale,
    pick: (entity: LocalizedFields, baseKey: string) =>
      pickLocalized(entity, baseKey, lang),
  };
}
