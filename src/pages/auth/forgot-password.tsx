import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useForgotPassword } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";

export default function ForgotPassword() {
  const { t } = useTranslation();
  usePageMetaI18n("auth.forgotTitle", "auth.forgotSubtitle");
  const { toast } = useToast();
  const forgotPasswordMutation = useForgotPassword();
  
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await forgotPasswordMutation.mutateAsync({ data: { email } });
      const link = `${window.location.origin}/auth/reset-password?token=${res.resetToken}`;
      setResetLink(link);
      setSubmitted(true);
      toast({ title: t("contact.successTitle"), description: t("auth.forgotSuccess"), variant: "default" });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : t("common.error");
      toast({ 
        title: t("common.error"), 
        description: msg, 
        variant: "destructive" 
      });
    }
  };

  return (
    <SiteLayout>
      <div className="flex-1 flex items-center justify-center py-12 px-4 bg-gray-50">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-primary">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-primary">{t("auth.forgotTitle")}</CardTitle>
            <CardDescription>{t("auth.forgotSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="bg-secondary text-primary p-4 rounded-lg text-sm">
                  {t("auth.forgotSuccess")}
                </div>
                <p className="text-xs text-muted-foreground">{t("auth.verifyMockHint")}</p>
                {resetLink && (
                  <Link href={resetLink.replace(window.location.origin, "")}>
                    <Button variant="link" className="text-xs break-all">
                      {t("auth.forgotOpenReset")}
                    </Button>
                  </Link>
                )}
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full">{t("auth.forgotBackLogin")}</Button>
                </Link>
              </div>
            ) : (
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
                <Button type="submit" className="w-full h-12" disabled={forgotPasswordMutation.isPending}>
                  {forgotPasswordMutation.isPending ? t("auth.forgotSubmitting") : t("auth.forgotSubmit")}
                </Button>
              </form>
            )}
            
            <div className="mt-6 text-center text-sm">
              <Link href="/auth/login" className="text-muted-foreground hover:text-primary">
                {t("auth.forgotBackLogin")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
