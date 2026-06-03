import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  FileText,
  HeartHandshake,
  MessageCircle,
  LogOut,
  Menu,
  X,
  Image,
  Settings2,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { ODEJ_LOGO_ALT_AR, ODEJ_LOGO_SRC } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useGetAdminPortalSummary } from "@/lib/api";
import { useTranslation } from "react-i18next";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { t } = useTranslation();
  const { data: summary } = useGetAdminPortalSummary();

  const pendingTotal =
    (summary?.pendingClubAccounts ?? 0) +
    (summary?.pendingTrainingPrograms ?? 0) +
    (summary?.pendingPartnerships ?? 0) +
    (summary?.pendingAppointments ?? 0) +
    (summary?.pendingDiwanApplications ?? 0);

  const menuItems = [
    { icon: LayoutDashboard, label: t("admin.navDashboard"), href: "/admin" },
    { icon: FileText, label: t("admin.navNews"), href: "/admin/news" },
    { icon: Calendar, label: t("admin.navEvents"), href: "/admin/events" },
    { icon: Building2, label: t("admin.navInstitutions"), href: "/admin/institutions" },
    {
      icon: GraduationCap,
      label: t("admin.navTraining"),
      href: "/admin/training-programs",
      badge: summary?.pendingTrainingPrograms,
    },
    {
      icon: Users,
      label: t("admin.navUsers"),
      href: "/admin/users",
      badge: summary?.pendingClubAccounts,
    },
    {
      icon: HeartHandshake,
      label: t("admin.navKhilya"),
      href: "/admin/khilya",
      badge: summary?.pendingAppointments,
    },
    {
      icon: Users,
      label: t("admin.navPartnerships"),
      href: "/admin/partnerships",
      badge: summary?.pendingPartnerships,
    },
    {
      icon: MessageCircle,
      label: t("admin.navDiwan"),
      href: "/admin/diwan",
      badge: summary?.pendingDiwanApplications,
    },
    { icon: Image, label: t("admin.navMedia"), href: "/admin/media" },
    { icon: Settings2, label: t("admin.navSettings"), href: "/admin/settings" },
  ];

  return (
    <div className="min-h-[100dvh] flex font-sans bg-gray-100">
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 right-0 z-50 w-72 bg-sidebar text-sidebar-foreground shadow-xl
        transform transition-transform duration-200 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        flex flex-col
      `}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2 min-w-0">
            <img
              src={ODEJ_LOGO_SRC}
              alt={ODEJ_LOGO_ALT_AR}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/30 bg-white"
            />
            <span className="font-bold text-lg truncate">{t("admin.portalBrand")}</span>
          </Link>
          <button
            type="button"
            className="lg:hidden shrink-0"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {pendingTotal > 0 && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-sm">
            {t("admin.pendingTasks", { count: pendingTotal })}
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => {
              const isActive =
                location === item.href ||
                (item.href !== "/admin" && location.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "hover:bg-white/5 text-sidebar-foreground/80 hover:text-white"
                    }
                  `}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <Badge className="bg-accent text-accent-foreground shrink-0">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold shrink-0">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{user?.name}</div>
              <div className="text-xs text-sidebar-foreground/70">{t("admin.roleLabel")}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/10 gap-2"
            onClick={() => {
              logout();
              setLocation("/portal");
            }}
          >
            <LogOut className="h-4 w-4" />
            {t("auth.logout")}
          </Button>
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-white hover:bg-white/5 gap-2 mt-2"
            >
              <ExternalLink className="h-4 w-4" />
              {t("admin.backToSite")}
            </Button>
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center px-4 lg:px-8 shrink-0 shadow-sm">
          <button
            type="button"
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-2"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 font-semibold text-lg text-gray-800">
            {menuItems.find(
              (item) =>
                location === item.href ||
                (item.href !== "/admin" && location.startsWith(`${item.href}/`)),
            )?.label || t("admin.navDashboard")}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
