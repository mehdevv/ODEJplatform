import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
  APP_LANGUAGES,
  LANGUAGE_LABELS,
  type AppLang,
} from "@/lib/languages";
import { setAppLanguage, getStoredLang } from "@/lib/i18n";
import { stripLocalePrefix, withLocalePrefix } from "@/components/routing/LocaleRouter";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [location, setLocation] = useLocation();
  const current = getStoredLang();

  const switchLang = (lang: AppLang) => {
    if (lang === current) return;
    setAppLanguage(lang);
    i18n.changeLanguage(lang);
    const bare = stripLocalePrefix(location);
    if (
      !bare.startsWith("/auth") &&
      !bare.startsWith("/admin") &&
      !bare.startsWith("/dashboard")
    ) {
      setLocation(withLocalePrefix(bare, lang));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:bg-primary-dark hover:text-white shrink-0 gap-1.5"
          aria-label={i18n.t("nav.language")}
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-bold">{LANGUAGE_LABELS[current].short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {APP_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchLang(lang)}
            className={current === lang ? "font-bold text-primary" : ""}
          >
            {LANGUAGE_LABELS[lang].native}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
