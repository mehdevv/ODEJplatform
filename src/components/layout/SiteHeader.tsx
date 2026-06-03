import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Menu, X, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NotificationBell } from "./NotificationBell";
import { NavbarOverflowMenu } from "./NavbarOverflowMenu";
import { NavbarSearch } from "./NavbarSearch";
import { WilayaSelector } from "./WilayaSelector";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { stripLocalePrefix } from "@/components/routing/LocaleRouter";
import { cn } from "@/lib/utils";
import { ODEJ_LOGO_ALT_AR, ODEJ_LOGO_SRC } from "@/lib/branding";
import { YouthFestivalNavLink } from "./YouthFestivalNavLink";

const PRIMARY_LINKS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/institutions", labelKey: "nav.institutions" },
  { href: "/activites", labelKey: "nav.activities" },
  { href: "/actualites", labelKey: "nav.news" },
] as const;

const WILAYA_SELECT_CLASS =
  "h-9 border-white/20 bg-white/10 text-primary-foreground [&_span]:text-primary-foreground [&_svg]:text-primary-foreground/80";

function NavItem({
  href,
  label,
  active,
  onClick,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "whitespace-nowrap border-b-2 pb-0.5 text-sm font-medium transition-colors",
        active
          ? "border-secondary text-secondary"
          : "border-transparent text-primary-foreground/95 hover:text-secondary",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const { t } = useTranslation();
  const barePath = stripLocalePrefix(location);

  const closeMobile = () => setIsMobileMenuOpen(false);
  const isHome = barePath === "/" || barePath === "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-14 items-center gap-2 px-3 md:h-16 md:gap-3 md:px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-bold transition-opacity hover:opacity-90 md:text-xl"
        >
          <img
            src={ODEJ_LOGO_SRC}
            alt={ODEJ_LOGO_ALT_AR}
            className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover ring-2 ring-white/30 bg-white"
          />
          <span className="hidden sm:inline">{t("brand")}</span>
        </Link>

        <nav
          className="hidden md:flex min-w-0 flex-1 items-center justify-center gap-3 lg:gap-5 xl:gap-6"
          aria-label={t("nav.main")}
        >
          {PRIMARY_LINKS.map(({ href, labelKey }) => (
            <NavItem
              key={href}
              href={href}
              label={t(labelKey)}
              active={href === "/" ? isHome : barePath === href}
            />
          ))}
          <YouthFestivalNavLink />
          <NavbarOverflowMenu />
        </nav>

        <div className="hidden md:flex shrink-0 items-center gap-1.5 lg:gap-2">
          <NavbarSearch />
          <WilayaSelector
            className={cn(
              "hidden w-[6.5rem] shrink-0 md:flex lg:w-[8rem] xl:w-[11rem]",
              WILAYA_SELECT_CLASS,
            )}
          />
          <LanguageSwitcher />
        </div>

        <div className="hidden md:flex shrink-0 items-center gap-1">
          <NotificationBell />
          {user ? (
            <>
              {(user.role === "admin" || user.role === "super_admin") && (
                <Link href="/portal">
                  <Button variant="secondary" size="sm" className="hidden xl:inline-flex">
                    {t("nav.admin")}
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-primary-foreground hover:bg-white/10 hover:text-white"
                >
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden lg:inline max-w-[6rem] truncate xl:max-w-[7rem]">
                    {t("nav.myAccount")}
                  </span>
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/auth">
              <Button variant="secondary" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
          )}
        </div>

        <button
          type="button"
          className="ms-auto rounded-md p-2 text-primary-foreground hover:bg-white/10 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-[hsl(123,64%,22%)] px-4 py-4 md:hidden">
          <div className="mb-4 flex flex-col gap-3">
            <NavbarSearch className="w-full" />
            <WilayaSelector className={cn("w-full", WILAYA_SELECT_CLASS)} />
            <LanguageSwitcher />
          </div>

          <nav className="flex flex-col gap-1 border-t border-white/10 pt-4" aria-label={t("nav.main")}>
            {PRIMARY_LINKS.map(({ href, labelKey }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMobile}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                  (href === "/" ? isHome : barePath === href)
                    ? "bg-white/15 text-secondary"
                    : "text-primary-foreground hover:bg-white/10",
                )}
              >
                {t(labelKey)}
              </Link>
            ))}
            <div className="px-3 py-2">
              <YouthFestivalNavLink
                variant="drawer"
                className="w-full justify-start px-2.5 py-2"
                onClick={closeMobile}
              />
            </div>
            <div className="pt-1">
              <NavbarOverflowMenu variant="bar" onNavigate={closeMobile} />
            </div>
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
            <NotificationBell />
            {user ? (
              <>
                {(user.role === "admin" || user.role === "super_admin") && (
                  <Link href="/portal" onClick={closeMobile}>
                    <Button variant="secondary" className="w-full justify-start">
                      {t("nav.admin")}
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard" onClick={closeMobile}>
                  <Button variant="secondary" className="w-full justify-start gap-2">
                    <UserIcon className="h-4 w-4" />
                    {t("nav.myAccount")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary-foreground hover:bg-white/10"
                  onClick={() => {
                    logout();
                    closeMobile();
                  }}
                >
                  {t("nav.logout")}
                </Button>
              </>
            ) : (
              <Link href="/auth" onClick={closeMobile}>
                <Button variant="secondary" className="w-full">
                  {t("nav.login")}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
