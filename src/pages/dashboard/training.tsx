import { SiteLayout } from "@/components/layout/SiteLayout";
import { useListMyTrainingEnrollments, useCancelTrainingEnrollment } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, ArrowLeft } from "lucide-react";

export default function DashboardTraining() {
  const { t } = useTranslation();
  const { dateLocale } = useLocalized();
  const { toast } = useToast();
  const { data: enrollments, isLoading, refetch } = useListMyTrainingEnrollments();
  const cancelMutation = useCancelTrainingEnrollment();

  const handleCancel = async (id: number) => {
    if (!confirm(t("training.cancelConfirm"))) return;
    try {
      await cancelMutation.mutateAsync(id);
      toast({ title: t("training.cancelled") });
      refetch();
    } catch {
      toast({ title: t("common.error"), variant: "destructive" });
    }
  };

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              {t("dashboard.back")}
            </Button>
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            {t("training.myEnrollments")}
          </h1>
        </div>
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : enrollments?.length ? (
          <div className="space-y-4">
            {enrollments.map((e) => (
              <Card key={e.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{e.programTitle}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-between items-center gap-4">
                  <div className="text-sm text-muted-foreground space-y-1">
                    {e.programStartDate && (
                      <p>
                        {new Date(e.programStartDate).toLocaleDateString(dateLocale, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    <p>{e.programLocation}</p>
                    <Badge variant={e.status === "waitlist" ? "secondary" : "default"}>
                      {t(`training.enrollment.${e.status}`)}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancel(e.id)}
                    disabled={cancelMutation.isPending}
                  >
                    {t("training.cancelEnrollment")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>{t("training.noEnrollments")}</p>
              <Link href="/formation">
                <Button className="mt-4">{t("training.browsePrograms")}</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </SiteLayout>
  );
}
