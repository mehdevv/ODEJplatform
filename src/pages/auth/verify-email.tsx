import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useVerifyEmail, useResendVerification } from "@/lib/api";
import { useLocation, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function VerifyEmail() {
  const { user, refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerification();

  if (!user) {
    return (
      <SiteLayout>
        <div className="container py-20 text-center">
          <Link href="/auth/login">
            <Button>{t("auth.login")}</Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  if (user.verified) {
    return (
      <SiteLayout>
        <div className="container py-20 max-w-md mx-auto text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">{t("auth.emailVerified")}</h1>
          <Link href="/dashboard">
            <Button>{t("auth.goDashboard")}</Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const handleVerify = async () => {
    try {
      await verifyMutation.mutateAsync({ userId: user.id });
      await refreshUser();
      toast({ title: t("auth.emailVerified") });
      setLocation("/dashboard");
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync({ userId: user.id });
      toast({ title: t("auth.verificationSent") });
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  return (
    <SiteLayout>
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Mail className="h-12 w-12 text-primary mx-auto mb-2" />
            <CardTitle>{t("auth.verifyTitle")}</CardTitle>
            <CardDescription>
              {t("auth.verifyDesc", { email: user.email })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">{t("auth.verifyMockHint")}</p>
            <Button className="w-full" onClick={handleVerify} disabled={verifyMutation.isPending}>
              {t("auth.confirmVerified")}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleResend} disabled={resendMutation.isPending}>
              {t("auth.resendVerification")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
