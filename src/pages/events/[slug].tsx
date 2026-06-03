import { SiteLayout } from "@/components/layout/SiteLayout";
import { useGetEvent, getGetEventQueryKey, useCreateRegistration } from "@/lib/api";
import { useParams, Link } from "wouter";
import { MapPin, Calendar as CalendarIcon, Clock, Users, ArrowRight, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { pick, dateLocale } = useLocalized();
  const [registering, setRegistering] = useState(false);
  
  const { data: event, isLoading, refetch } = useGetEvent(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetEventQueryKey(slug)
    }
  });

  const registerMutation = useCreateRegistration();

  const handleRegister = async () => {
    if (!user) {
      toast({ title: t("common.error"), description: t("events.loginRequired"), variant: "destructive" });
      return;
    }
    if (!event) return;

    setRegistering(true);
    try {
      await registerMutation.mutateAsync({ data: { eventId: event.id } });
      toast({ title: t("events.registerSuccess"), variant: "default" });
      refetch();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : t("common.error");
      toast({ title: t("common.error"), description: msg, variant: "destructive" });
    } finally {
      setRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-64 w-full rounded-xl mb-8" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!event) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-700">{t("events.notFound")}</h2>
          <Link href="/activites">
            <Button className="mt-4">{t("events.backToList")}</Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const title = pick(event, "title");
  const description = pick(event, "description");
  const institutionName = pick(event, "institutionName") || event.institutionNameAr;
  const isUpcoming = new Date(event.startDate) > new Date();
  const isFull = event.capacity && event.registrationCount !== undefined && event.registrationCount >= event.capacity;

  const msUntil = isUpcoming
    ? new Date(event.startDate).getTime() - Date.now()
    : 0;
  const daysUntil = Math.max(0, Math.floor(msUntil / (1000 * 60 * 60 * 24)));

  return (
    <SiteLayout>
      <div className="bg-primary/5 py-6 border-b">
        <div className="container mx-auto px-4">
          <Link href="/activites" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium">
            <ArrowRight className="h-4 w-4" /> {t("events.backToList")}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="relative aspect-[16/10] min-h-[280px] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
              {event.featuredImage ? (
                <img 
                  src={event.featuredImage} 
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center text-primary/30">
                  <CalendarIcon className="h-20 w-20" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-bold">
                  {event.categoryNameAr || t("nav.activities")}
                </span>
                {isUpcoming ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">{t("events.statusUpcoming")}</span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm font-bold">{t("events.statusEnded")}</span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
              
              <div className="prose max-w-none text-gray-700 leading-relaxed pt-4 border-t">
                {description ? (
                  <p>{description}</p>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-24 border-primary/20 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-xl border-b pb-4">{t("events.details")}</h3>

                {isUpcoming && (
                  <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center">
                    <div className="text-sm text-accent font-bold mb-2">{t("events.startsIn")}</div>
                    <div className="flex justify-center gap-4 text-2xl font-bold text-gray-900">
                      <span>{t("events.days", { count: daysUntil })}</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {new Date(event.startDate).toLocaleDateString(dateLocale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {new Date(event.startDate).toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString(dateLocale, { hour: '2-digit', minute: '2-digit' })}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{event.location || "—"}</div>
                      {institutionName && (
                        <Link href={`/institutions/${event.institutionId}`} className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                          <Building className="h-3 w-3" /> {institutionName}
                        </Link>
                      )}
                    </div>
                  </div>

                  {event.capacity && (
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="w-full">
                        <div className="text-sm text-gray-500 mb-1 flex justify-between">
                          <span>{t("events.spotsAvailable")}</span>
                          <span className="font-bold text-gray-900">{event.registrationCount || 0} / {event.capacity}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${isFull ? 'bg-red-500' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(100, ((event.registrationCount || 0) / event.capacity) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t">
                  {!isUpcoming ? (
                    <Button className="w-full bg-gray-300 hover:bg-gray-300 text-gray-600 cursor-not-allowed">
                      {t("events.statusEnded")}
                    </Button>
                  ) : isFull ? (
                    <Button className="w-full bg-red-100 text-red-600 hover:bg-red-100 hover:text-red-600 cursor-not-allowed">
                      {t("events.full")}
                    </Button>
                  ) : !user ? (
                    <div className="text-center space-y-3">
                      <p className="text-sm text-gray-500">{t("events.loginRequired")}</p>
                      <Link href="/auth/login">
                        <Button className="w-full">{t("auth.login")}</Button>
                      </Link>
                    </div>
                  ) : (
                    <Button 
                      className="w-full text-lg h-12" 
                      onClick={handleRegister}
                      disabled={registering}
                    >
                      {registering ? t("events.registering") : t("events.register")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
