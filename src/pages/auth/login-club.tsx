import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";

export default function LoginClub() {
  const { t } = useTranslation();
  usePageMetaI18n("auth.clubLoginTitle");
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const path = await login({ email, password });
      toast({ title: t("auth.loginSuccess") });
      setLocation(path);
    } catch (error: unknown) {
      toast({
        title: t("auth.loginError"),
        description: error instanceof Error ? error.message : t("auth.loginErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-accent border-2 border-primary">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-primary">
              {t("auth.clubLoginTitle")}
            </CardTitle>
            <CardDescription>{t("auth.clubLoginSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-left"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-left pr-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-12 bg-secondary hover:bg-secondary/90" disabled={loading}>
                {loading ? t("auth.loggingIn") : t("auth.login")}
              </Button>
            </form>
            <p className="mt-4 text-xs text-center text-muted-foreground bg-primary/5 p-3 rounded-lg border border-primary/10">
              {t("auth.demoClubHint")}
            </p>
            <div className="mt-4 text-center text-sm space-y-2">
              <Link href="/auth/register/club" className="text-primary font-bold hover:underline block">
                {t("auth.registerClub")}
              </Link>
              <Link href="/auth" className="text-muted-foreground hover:underline inline-flex items-center gap-1">
                <ArrowRight className="h-3 w-3" /> {t("auth.backToHub")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
