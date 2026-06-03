import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "@/lib/api";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function ResetPassword() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const resetMutation = useResetPassword();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: t("auth.passwordMismatch"), variant: "destructive" });
      return;
    }
    if (!token) {
      toast({ title: t("auth.invalidToken"), variant: "destructive" });
      return;
    }
    try {
      await resetMutation.mutateAsync({ data: { token, password } });
      toast({ title: t("auth.passwordResetSuccess") });
      setLocation("/auth/login");
    } catch (err: unknown) {
      toast({
        title: err instanceof Error ? err.message : t("common.error"),
        variant: "destructive",
      });
    }
  };

  if (!token) {
    return (
      <SiteLayout>
        <div className="container py-20 text-center max-w-md mx-auto">
          <p className="text-muted-foreground mb-4">{t("auth.invalidToken")}</p>
          <Link href="/auth/forgot-password">
            <Button>{t("auth.forgotPassword")}</Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{t("auth.resetPasswordTitle")}</CardTitle>
            <CardDescription>{t("auth.resetPasswordDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">{t("auth.newPassword")}</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    dir="ltr"
                  />
                  <button
                    type="button"
                    className="absolute end-2 top-1/2 -translate-y-1/2 text-xs text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? t("auth.hide") : t("auth.show")}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirm">{t("auth.confirmPassword")}</Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  className="mt-1"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  dir="ltr"
                />
              </div>
              <Button type="submit" className="w-full" disabled={resetMutation.isPending}>
                {t("auth.resetPassword")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
