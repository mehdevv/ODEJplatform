import { useAuth } from "@/lib/auth";
import { useGetMyClubProfile } from "@/lib/api";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { useTranslation } from "react-i18next";
import { Clock, XCircle, FileText } from "lucide-react";
import { openAgreementDocument } from "@/components/club/AgreementUploadField";

export function RequireClub({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { data: profile, isLoading: profileLoading } = useGetMyClubProfile({
    query: { enabled: !!user && user.role === "club" },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth/login/club");
    } else if (!authLoading && user && user.role !== "club") {
      setLocation("/dashboard");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || profileLoading) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-12 space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </SiteLayout>
    );
  }

  if (!user || user.role !== "club") return null;

  if (!profile) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">{t("club.profileNotFound")}</p>
        </div>
      </SiteLayout>
    );
  }

  if (profile.status === "pending") {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Card className="max-w-lg w-full border-t-4 border-amber-500">
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-amber-500 mx-auto mb-2" />
              <CardTitle>{t("club.pendingTitle")}</CardTitle>
              <CardDescription>{t("club.pendingDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">{profile.organizationName}</p>
              {profile.agreementFileName && (
                <div className="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
                  <p>{t("club.agreementSubmitted")}</p>
                  <p className="font-medium truncate" dir="ltr">
                    {profile.agreementFileName}
                  </p>
                  {profile.agreementDataUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => openAgreementDocument(profile)}
                    >
                      <FileText className="h-4 w-4" />
                      {t("club.agreementView")}
                    </Button>
                  )}
                </div>
              )}
              <p className="text-xs text-muted-foreground">{t("club.pendingApprovalNote")}</p>
              <Link href="/contact">
                <Button variant="outline">{t("club.contactUs")}</Button>
              </Link>
              <div>
                <Button variant="ghost" onClick={() => setLocation("/auth")}>
                  {t("auth.backToHub")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SiteLayout>
    );
  }

  if (profile.status === "rejected") {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <Card className="max-w-lg w-full border-t-4 border-destructive">
            <CardHeader className="text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
              <CardTitle>{t("club.rejectedTitle")}</CardTitle>
              <CardDescription>
                {profile.reviewNote ?? t("club.rejectedDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/contact">
                <Button>{t("club.contactUs")}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </SiteLayout>
    );
  }

  return <>{children}</>;
}
