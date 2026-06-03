import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "@/locales/ar.json";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";
import kab from "@/locales/kab.json";
import uiAr from "@/locales/ui-ar.json";
import uiFr from "@/locales/ui-fr.json";
import uiEn from "@/locales/ui-en.json";
import uiKab from "@/locales/ui-kab.json";
import { mergeLocales } from "@/lib/merge-locales";
import {
  APP_LANGUAGES,
  type AppLang,
  getTextDirection,
  isAppLang,
} from "@/lib/languages";

const LANG_KEY = "odej_lang";

export type { AppLang };

export function getStoredLang(): AppLang {
  const stored = localStorage.getItem(LANG_KEY);
  if (stored && isAppLang(stored)) return stored;
  return "ar";
}

export function setAppLanguage(lang: AppLang) {
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === "kab" ? "kab" : lang;
  document.documentElement.dir = getTextDirection(lang);
  document.body.style.direction = getTextDirection(lang);
  return i18n.changeLanguage(lang);
}

const resources = {
  ar: { translation: mergeLocales(ar, uiAr) },
  fr: { translation: mergeLocales(fr, uiFr) },
  en: { translation: mergeLocales(en, uiEn) },
  kab: { translation: mergeLocales(kab, uiKab) },
};

i18n.use(initReactI18next).init({
  resources,
  lng: typeof window !== "undefined" ? getStoredLang() : "ar",
  fallbackLng: "ar",
  supportedLngs: [...APP_LANGUAGES],
  interpolation: { escapeValue: false },
});

if (typeof window !== "undefined") {
  setAppLanguage(getStoredLang());
}

export default i18n;
