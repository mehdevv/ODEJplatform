import { Link, useLocation } from "wouter";
import { SiteLayout } from "./SiteLayout";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, FileText, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function ClubLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const { t } = useTranslation();

  const links = [
    { href: "/club", label: t("club.navDashboard"), icon: LayoutDashboard },
    { href: "/club/programs", label: t("club.navPrograms"), icon: FileText },
    { href: "/club/profile", label: t("club.navProfile"), icon: User },
  ];

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <div className="bg-primary text-white rounded-xl p-6 mb-4">
              <p className="font-bold text-lg">{user?.name}</p>
              <p className="text-sm opacity-80">{t("club.portalTitle")}</p>
            </div>
            <nav className="space-y-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                    location === href || location.startsWith(`${href}/`)
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive"
                onClick={() => logout()}
              >
                <LogOut className="h-4 w-4" />
                {t("auth.logout")}
              </Button>
            </nav>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SiteLayout>
  );
}
