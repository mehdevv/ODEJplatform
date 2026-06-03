import { SiteLayout } from "@/components/layout/SiteLayout";
import { useGetTrainingProgram, useEnrollInTrainingProgram } from "@/lib/api";
import { useParams, Link } from "wouter";
import { MapPin, Calendar as CalendarIcon, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";

export default function TrainingDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { pick, dateLocale } = useLocalized();
  const [registering, setRegistering] = useState(false);

  const { data: program, isLoading, refetch } = useGetTrainingProgram(slug ?? "", {
    query: { enabled: !!slug },
  });

  const enrollMutation = useEnrollInTrainingProgram();

  const handleEnroll = async () => {
    if (!user) {
      toast({
        title: t("common.error"),
        description: t("training.loginRequired"),
        variant: "destructive",
      });
      return;
    }
    if (!program) return;
    setRegistering(true);
    try {
      await enrollMutation.mutateAsync(program.id);
      toast({ title: t("training.enrollSuccess") });
      refetch();
    } catch (error: unknown) {
      toast({
        title: t("common.error"),
        description: error instanceof Error ? error.message : t("common.error"),
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <Skeleton className="h-40 w-full" />
        </div>
      </SiteLayout>
    );
  }

  if (!program || program.status !== "published") {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold">{t("training.notFound")}</h2>
          <Link href="/formation">
            <Button className="mt-4">{t("training.backToList")}</Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const title = pick(program.title, program.titleFr, program.titleEn, program.titleKab);
  const description = pick(
    program.descriptionAr ?? program.description,
    program.descriptionFr,
    program.descriptionEn,
  );

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-2xl overflow-hidden mb-8 h-64 md:h-80 relative">
          <img
            src={program.featuredImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge>{t(`training.format.${program.format}`)}</Badge>
                <Badge variant="secondary">{t(`training.level.${program.level}`)}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {program.clubName && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-5 w-5" />
                {program.clubName}
              </p>
            )}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          </div>
          <Card className="h-fit border-t-4 border-primary">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-primary" />
                {new Date(program.startDate).toLocaleDateString(dateLocale, {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                {program.location}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-primary" />
                {program.enrollmentCount ?? 0} / {program.capacity} {t("training.seats")}
              </div>
              {user?.role === "club" ? (
                <p className="text-sm text-amber-600">{t("training.clubCannotEnroll")}</p>
              ) : (
                <Button className="w-full" onClick={handleEnroll} disabled={registering}>
                  {registering ? t("common.loading") : t("training.enroll")}
                </Button>
              )}
              {!user && (
                <Link href="/auth/login/youth">
                  <Button variant="outline" className="w-full">
                    {t("auth.login")}
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SiteLayout>
  );
}
