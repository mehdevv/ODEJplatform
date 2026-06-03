import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Building2, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { ODEJ_LOGO_ALT_AR, ODEJ_LOGO_SRC } from "@/lib/branding";

export default function AuthHub() {
  const { t } = useTranslation();
  usePageMetaI18n("auth.hubTitle", "auth.hubSubtitle");

  return (
    <SiteLayout>
      <div className="flex-1 flex items-center justify-center min-h-[calc(100dvh-4rem)] py-12 px-4 sm:px-6 bg-gray-50">
        <div className="w-full max-w-5xl space-y-10">
          <div className="text-center space-y-3">
            <img
              src={ODEJ_LOGO_SRC}
              alt={ODEJ_LOGO_ALT_AR}
              className="h-20 w-20 sm:h-24 sm:w-24 mx-auto rounded-full object-cover ring-4 ring-primary/20 shadow-md bg-white"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">
              {t("auth.hubTitle")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("auth.hubSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <Card className="flex flex-col border-2 border-primary shadow-lg hover:shadow-xl transition-all min-h-[340px] sm:min-h-[380px]">
              <CardHeader className="text-center pb-2 pt-8 px-8 sm:px-10">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Users className="h-9 w-9 text-primary" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
                  {t("auth.youthAccount")}
                </CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">
                  {t("auth.youthAccountDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 px-8 sm:px-10 pb-8 sm:pb-10 mt-auto">
                <Link href="/auth/login/youth" className="block w-full">
                  <Button className="w-full h-12 text-base font-semibold">
                    {t("auth.login")}
                  </Button>
                </Link>
                <Link href="/auth/register/youth" className="block w-full">
                  <Button variant="outline" className="w-full h-12 text-base border-2">
                    {t("auth.registerNow")}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="flex flex-col border-2 border-primary shadow-lg hover:shadow-xl transition-all min-h-[340px] sm:min-h-[380px] ring-1 ring-primary/10">
              <CardHeader className="text-center pb-2 pt-8 px-8 sm:px-10 border-t-4 border-t-accent rounded-t-lg">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Building2 className="h-9 w-9 text-primary" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">
                  {t("auth.clubAccount")}
                </CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">
                  {t("auth.clubAccountDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 px-8 sm:px-10 pb-8 sm:pb-10 mt-auto">
                <Link href="/auth/login/club" className="block w-full">
                  <Button className="w-full h-12 text-base font-semibold">
                    {t("auth.login")}
                  </Button>
                </Link>
                <Link href="/auth/register/club" className="block w-full">
                  <Button variant="outline" className="w-full h-12 text-base border-2">
                    {t("auth.registerClub")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center pt-4 border-t">
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Shield className="h-4 w-4" />
              {t("admin.portalLink")}
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
