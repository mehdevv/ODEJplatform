import { ClubLayout } from "@/components/layout/ClubLayout";
import { useGetClubDashboard } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

export default function ClubDashboard() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetClubDashboard();

  if (isLoading) {
    return (
      <ClubLayout>
        <Skeleton className="h-48 w-full" />
      </ClubLayout>
    );
  }

  if (!data) return null;

  const { profile, programsByStatus, recentPrograms } = data;

  return (
    <ClubLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold">{profile.organizationName}</h1>
            <p className="text-muted-foreground">{t("club.dashboardWelcome")}</p>
          </div>
          <Link href="/club/programs/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("club.newProgram")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(["draft", "submitted", "approved", "rejected", "published"] as const).map(
            (status) => (
              <Card key={status}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {programsByStatus[status]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(`training.status.${status}`)}
                  </p>
                </CardContent>
              </Card>
            ),
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("club.recentPrograms")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPrograms.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t("club.noPrograms")}</p>
            ) : (
              recentPrograms.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <Badge variant="outline" className="mt-1">
                      {t(`training.status.${p.status}`)}
                    </Badge>
                  </div>
                  {["draft", "rejected"].includes(p.status) && (
                    <Link href={`/club/programs/${p.id}/edit`}>
                      <Button size="sm" variant="outline">
                        {t("common.edit")}
                      </Button>
                    </Link>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </ClubLayout>
  );
}
