import { Link, useLocation } from "wouter";
import { Facebook } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FooterQr } from "./FooterQr";
import { SiteAnnouncement } from "./SiteAnnouncement";
import { SiteHeader } from "./SiteHeader";
import { useGetSiteSettings } from "@/lib/api";
import { stripLocalePrefix } from "@/components/routing/LocaleRouter";
import { ODEJ_LOGO_ALT_AR, ODEJ_LOGO_SRC } from "@/lib/branding";
import { OdejChatbot } from "@/components/chat/OdejChatbot";

export function SiteLayout({
  children,
  hideFooter,
}: {
  children: React.ReactNode;
  hideFooter?: boolean;
}) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { data: siteSettings } = useGetSiteSettings();
  const bare = stripLocalePrefix(location);
  const isAuthRoute =
    hideFooter ?? (bare.startsWith("/auth") || bare === "/portal");
  const showChatbot =
    !bare.startsWith("/admin") && bare !== "/portal";

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-[100] focus:bg-white focus:text-primary focus:px-4 focus:py-2 focus:rounded-md"
      >
        {t("common.skipToContent")}
      </a>

      <SiteAnnouncement />
      {siteSettings?.maintenanceMode?.enabled && (
        <div className="bg-error text-white text-center py-2 text-sm px-4">
          {siteSettings.maintenanceMode.message}
        </div>
      )}
      <SiteHeader />

      <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
        {children}
      </main>

      {showChatbot && <OdejChatbot />}

      {!isAuthRoute && (
      <footer className="bg-sidebar text-sidebar-foreground py-12 border-t-4 border-accent">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={ODEJ_LOGO_SRC}
                alt={ODEJ_LOGO_ALT_AR}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-white/20 bg-white"
              />
              <h3 className="font-bold text-xl">{t("brand")}</h3>
            </div>
            <p className="text-sm text-sidebar-foreground/80 leading-relaxed mb-4">
              {t("footer.description")}
            </p>
            <a
              href={siteSettings?.facebookUrl ?? "https://facebook.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:text-accent transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
              Facebook
            </a>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-secondary">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/institutions"
                  className="hover:text-accent transition-colors"
                >
                  {t("nav.institutions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/activites"
                  className="hover:text-accent transition-colors"
                >
                  {t("nav.activities")}
                </Link>
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="hover:text-accent transition-colors"
                >
                  {t("nav.news")}
                </Link>
              </li>
              <li>
                <Link
                  href="/a-propos"
                  className="hover:text-accent transition-colors"
                >
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-secondary">
              {t("footer.services")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/khilya"
                  className="hover:text-accent transition-colors"
                >
                  {t("nav.khilya")}
                </Link>
              </li>
              <li>
                <Link href="/diwan" className="hover:text-accent transition-colors">
                  {t("nav.diwan")}
                </Link>
              </li>
              <li>
                <Link
                  href="/partenariats"
                  className="hover:text-accent transition-colors"
                >
                  {t("nav.partnerships")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-secondary">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/80 mb-4">
              <li>{t("footer.address")}</li>
              <li>contact@odejbejaia.dz</li>
              <li dir="ltr">+213 34 21 45 00</li>
            </ul>
            <FooterQr />
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-sidebar-foreground/60">
          <p>
            © {new Date().getFullYear()} {t("tagline")}. {t("footer.copyright")}
          </p>
        </div>
      </footer>
      )}
    </div>
  );
}
