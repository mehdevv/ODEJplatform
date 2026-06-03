import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  HeartHandshake,
  Users,
  Mail,
  Info,
  Handshake,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { stripLocalePrefix } from "@/components/routing/LocaleRouter";

const OVERFLOW_LINKS = [
  { href: "/formation", labelKey: "nav.training", icon: GraduationCap },
  { href: "/khilya", labelKey: "nav.khilya", icon: HeartHandshake },
  { href: "/diwan", labelKey: "nav.diwan", icon: Users },
  { href: "/contact", labelKey: "nav.contact", icon: Mail },
  { href: "/a-propos", labelKey: "nav.about", icon: Info },
  { href: "/partenariats", labelKey: "nav.partnerships", icon: Handshake },
] as const;

interface NavbarOverflowMenuProps {
  onNavigate?: () => void;
  variant?: "icon" | "bar";
}

export function NavbarOverflowMenu({
  onNavigate,
  variant = "icon",
}: NavbarOverflowMenuProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const barePath = stripLocalePrefix(location);
  const isOverflowActive = OVERFLOW_LINKS.some((l) => barePath === l.href);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "bar" ? (
          <Button
            variant="ghost"
            className="h-11 w-full justify-between px-3 text-primary-foreground hover:bg-white/10 hover:text-white"
          >
            <span className="font-medium">{t("nav.more")}</span>
            <ChevronDown className="h-4 w-4 opacity-80" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className={`shrink-0 gap-1 text-primary-foreground hover:bg-white/10 hover:text-white ${
              isOverflowActive ? "bg-white/15 text-secondary" : ""
            }`}
            aria-label={t("nav.more")}
          >
            <span className="hidden lg:inline text-sm font-medium">{t("nav.more")}</span>
            <ChevronDown className="h-4 w-4 opacity-90" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === "bar" ? "start" : "end"}
        className="w-56"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t("nav.morePages")}
        </DropdownMenuLabel>
        {OVERFLOW_LINKS.map(({ href, labelKey, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link
              href={href}
              className={`flex cursor-pointer items-center gap-2 ${
                barePath === href ? "font-semibold text-primary" : ""
              }`}
              onClick={onNavigate}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-70" />
              {t(labelKey)}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
