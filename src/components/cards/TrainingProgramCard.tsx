import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CardMedia } from "@/components/ui/card-media";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, GraduationCap } from "lucide-react";
import type { TrainingProgram } from "@/lib/api";
import { useLocalized } from "@/lib/localized-content";
import { useTranslation } from "react-i18next";

interface TrainingProgramCardProps {
  program: TrainingProgram;
}

export function TrainingProgramCard({ program }: TrainingProgramCardProps) {
  const { t } = useTranslation();
  const { pick, dateLocale } = useLocalized();
  const title = pick(program.title, program.titleFr, program.titleEn, program.titleKab);

  return (
    <Link href={`/formation/${program.slug}`}>
      <Card className="group flex h-full cursor-pointer flex-col overflow-hidden border-transparent shadow-sm transition-all hover:shadow-md hover-elevate">
        <CardMedia
          src={program.featuredImage}
          alt={title}
          className="aspect-[16/10] min-h-[200px] w-full"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
          fallback={<GraduationCap className="h-12 w-12" />}
        />
        <CardContent className="flex flex-1 flex-col space-y-3 p-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{t(`training.format.${program.format}`)}</Badge>
            <Badge variant="outline">{t(`training.level.${program.level}`)}</Badge>
          </div>
          <h3 className="line-clamp-2 text-lg font-bold transition-colors group-hover:text-primary">
            {title}
          </h3>
          {program.clubName && (
            <p className="text-sm text-muted-foreground">{program.clubName}</p>
          )}
          <div className="mt-auto flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4 shrink-0" />
              {new Date(program.startDate).toLocaleDateString(dateLocale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4 shrink-0" />
              {program.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4 shrink-0" />
              {program.enrollmentCount ?? 0} / {program.capacity}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
