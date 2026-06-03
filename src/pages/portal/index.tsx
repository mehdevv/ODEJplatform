import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { ODEJ_LOGO_ALT_AR, ODEJ_LOGO_SRC } from "@/lib/branding";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

export default function AdminPortalEntry() {
  const { t } = useTranslation();
  usePageMetaI18n("admin.portalTitle", "admin.portalSubtitle");
  const { user, isLoading, login, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin" || user.role === "super_admin") {
        setLocation("/admin");
      } else if (user.role === "club") {
        setLocation("/club");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [user, isLoading, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const path = await login({ email, password });
      if (path.startsWith("/admin")) {
        setLocation(path);
      } else {
        await logout();
        toast({
          title: t("admin.accessDenied"),
          description: t("admin.staffOnly"),
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      toast({
        title: t("auth.loginError"),
        description:
          error instanceof Error ? error.message : t("auth.loginErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || user) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-sidebar">
        <div className="h-10 w-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex font-sans">
      <aside className="hidden lg:flex lg:w-[42%] xl:w-[45%] bg-sidebar text-sidebar-foreground flex-col justify-between p-10 xl:p-14">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <img
              src={ODEJ_LOGO_SRC}
              alt={ODEJ_LOGO_ALT_AR}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-white/40 bg-white"
            />
            <div>
              <p className="text-xs uppercase tracking-widest text-white/60">ODEJ</p>
              <p className="font-bold text-xl">{t("admin.portalBrand")}</p>
            </div>
          </div>
          <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
            {t("admin.portalHero")}
          </h1>
          <p className="text-white/75 text-lg leading-relaxed max-w-md">
            {t("admin.portalHeroDesc")}
          </p>
        </div>
        <ul className="space-y-4 text-sm text-white/80">
          <li className="flex items-center gap-3">
            <Users className="h-5 w-5 shrink-0 text-accent" />
            {t("admin.portalFeatureUsers")}
          </li>
          <li className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 shrink-0 text-accent" />
            {t("admin.portalFeatureTraining")}
          </li>
          <li className="flex items-center gap-3">
            <Building2 className="h-5 w-5 shrink-0 text-accent" />
            {t("admin.portalFeatureClubs")}
          </li>
          <li className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 shrink-0 text-accent" />
            {t("admin.portalFeatureContent")}
          </li>
        </ul>
      </aside>

      <main className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 bg-gray-50">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img
              src={ODEJ_LOGO_SRC}
              alt={ODEJ_LOGO_ALT_AR}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20 bg-white"
            />
            <span className="font-bold text-lg text-primary">{t("admin.portalBrand")}</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {t("admin.portalSignIn")}
          </h2>
          <p className="text-muted-foreground mb-8">{t("admin.portalSignInDesc")}</p>

          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border">
            <div className="space-y-2">
              <Label htmlFor="admin-email">{t("auth.email")}</Label>
              <Input
                id="admin-email"
                type="email"
                required
                dir="ltr"
                className="text-left h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  dir="ltr"
                  className="text-left h-11 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={submitting}>
              {submitting ? t("auth.loggingIn") : t("admin.portalEnter")}
            </Button>
            <p className="text-xs text-center text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
              {t("admin.demoHint")}
            </p>
          </form>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("admin.backToSite")}
          </Link>
        </div>
      </main>
    </div>
  );
}
