import { Link } from "wouter";
import { useListEvents } from "@/lib/api";
import { EventCard } from "@/components/cards/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ActivitiesSectionProps {
  institutionId: number;
  institutionSlug: string;
}

export function ActivitiesSection({
  institutionId,
  institutionSlug,
}: ActivitiesSectionProps) {
  const { t } = useTranslation();
  const { data: res, isLoading } = useListEvents({
    institutionId,
    status: "published",
    limit: 12,
    page: 1,
  });

  const events = res?.data ?? [];

  if (isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className="space-y-6" aria-labelledby="institution-activities-heading">
      <div className="flex items-center justify-between">
        <h2
          id="institution-activities-heading"
          className="text-2xl font-bold text-gray-900 flex items-center gap-2"
        >
          <Calendar className="h-6 w-6 text-primary" />
          {t("home.upcomingActivities")}
        </h2>
        <Link href={`/activites?institution=${institutionSlug}`}>
          <Button variant="outline" size="sm">
            {t("notifications.viewAll")}
          </Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
