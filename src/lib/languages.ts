export const APP_LANGUAGES = ["ar", "fr", "en", "kab"] as const;
export type AppLang = (typeof APP_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<
  AppLang,
  { native: string; short: string }
> = {
  ar: { native: "العربية", short: "AR" },
  fr: { native: "Français", short: "FR" },
  en: { native: "English", short: "EN" },
  kab: { native: "Taqbaylit", short: "KAB" },
};

export function isAppLang(value: string): value is AppLang {
  return (APP_LANGUAGES as readonly string[]).includes(value);
}

export function getTextDirection(lang: AppLang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}
