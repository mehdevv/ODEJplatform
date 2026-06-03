import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetTrainingProgram, useReviewTrainingProgram } from "@/lib/api";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export default function AdminTrainingReview() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id ?? "0", 10);
  const { toast } = useToast();
  const [note, setNote] = useState("");
  const { data: program, isLoading, refetch } = useGetTrainingProgram(String(id), {
    query: { enabled: id > 0 },
  });
  const reviewMutation = useReviewTrainingProgram();

  const run = async (action: "approve" | "reject" | "publish") => {
    try {
      await reviewMutation.mutateAsync({ id, data: { action, reviewNote: note || undefined } });
      toast({ title: t("training.reviewDone") });
      refetch();
    } catch (error: unknown) {
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : undefined,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Skeleton className="h-64 w-full" />
      </AdminLayout>
    );
  }

  if (!program) {
    return (
      <AdminLayout>
        <p>{t("training.notFound")}</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <Link href="/admin/training-programs">
          <Button variant="ghost">{t("training.backToAdmin")}</Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {program.title}
              <Badge>{t(`training.status.${program.status}`)}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{program.clubName}</p>
            <p className="whitespace-pre-line">{program.descriptionAr ?? program.description}</p>
            <p>
              <strong>{t("training.fieldLocation")}:</strong> {program.location}
            </p>
            <p>
              <strong>{t("training.fieldStart")}:</strong>{" "}
              {new Date(program.startDate).toLocaleString("ar-DZ")}
            </p>
            {program.reviewNote && (
              <p className="text-destructive text-sm">{program.reviewNote}</p>
            )}
            <div className="space-y-2">
              <Label>{t("training.reviewNote")}</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
            </div>
            <div className="flex flex-wrap gap-2">
              {program.status === "submitted" && (
                <>
                  <Button onClick={() => run("approve")}>{t("training.approve")}</Button>
                  <Button variant="destructive" onClick={() => run("reject")}>
                    {t("training.reject")}
                  </Button>
                </>
              )}
              {(program.status === "approved" || program.status === "submitted") && (
                <Button variant="secondary" onClick={() => run("publish")}>
                  {t("training.publish")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
