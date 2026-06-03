import { ClubLayout } from "@/components/layout/ClubLayout";
import { useGetMyClubProfile, useListTrainingPrograms } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function ClubProgramsList() {
  const { t } = useTranslation();
  const { data: profile } = useGetMyClubProfile();
  const { data: res, isLoading } = useListTrainingPrograms(
    profile ? { clubProfileId: profile.id } : undefined,
    { query: { enabled: !!profile } },
  );

  return (
    <ClubLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("club.navPrograms")}</h1>
          <Link href="/club/programs/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("club.newProgram")}
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="space-y-3">
            {res?.data.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="font-bold">{p.title}</p>
                    <Badge variant="outline" className="mt-1">
                      {t(`training.status.${p.status}`)}
                    </Badge>
                  </div>
                  {["draft", "rejected"].includes(p.status) ? (
                    <Link href={`/club/programs/${p.id}/edit`}>
                      <Button variant="outline" size="sm">
                        {t("common.edit")}
                      </Button>
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {t("club.readOnly")}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
            {!res?.data.length && (
              <p className="text-muted-foreground text-center py-8">{t("club.noPrograms")}</p>
            )}
          </div>
        )}
      </div>
    </ClubLayout>
  );
}
