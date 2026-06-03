import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CardMedia } from "@/components/ui/card-media";
import { MapPin, Calendar, Activity } from "lucide-react";
import { useLocalized } from "@/lib/localized-content";
import type { Event } from "@/lib/api";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { pick, dateLocale } = useLocalized();
  const title = pick(event, "title");
  const description = pick(event, "description");
  const institutionName = pick(event, "institutionName") || event.institutionName;
  const start = new Date(event.startDate);
  const day = start.getDate();
  const month = start.toLocaleDateString(dateLocale, { month: "short" });

  return (
    <Link href={`/activites/${event.slug}`}>
      <Card className="group flex h-full cursor-pointer flex-col overflow-hidden border-transparent shadow-sm transition-all hover:shadow-md hover-elevate">
        <div className="relative w-full shrink-0">
          <CardMedia
            src={event.featuredImage}
            alt={title}
            className="aspect-[16/10] min-h-[200px] w-full"
            imageClassName="transition-transform duration-500 group-hover:scale-105"
            fallback={<Activity className="h-12 w-12" />}
          />
          <div className="absolute start-3 top-3 flex min-w-[3.5rem] flex-col items-center rounded-lg bg-primary px-3 py-2 text-center text-white shadow-lg">
            <span className="text-2xl font-bold leading-none">{day}</span>
            <span className="text-xs opacity-90">{month}</span>
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col p-5">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold transition-colors group-hover:text-primary">
            {title}
          </h3>
          {description && (
            <p className="mb-3 line-clamp-2 flex-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
          <div className="mt-auto flex flex-wrap gap-3 text-xs text-muted-foreground">
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {event.location}
              </span>
            )}
            {institutionName && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {institutionName}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
