import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CardMedia } from "@/components/ui/card-media";
import { MapPin, Building } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";
import type { Institution } from "@/lib/api";

const TYPE_KEYS: Record<string, string> = {
  youth_house: "institutions.typeYouthHouse",
  culture_center: "institutions.typeCulture",
  sports_complex: "institutions.typeSports",
  camp: "institutions.typeCamp",
};

interface InstitutionCardProps {
  institution: Institution;
}

export function InstitutionCard({ institution }: InstitutionCardProps) {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const name = pick(institution, "name");
  const typeKey = TYPE_KEYS[institution.type];

  return (
    <Link href={`/institutions/${institution.slug}`}>
      <Card className="group flex h-full cursor-pointer flex-col overflow-hidden border-transparent shadow-sm transition-all hover:shadow-md hover-elevate">
        <div className="relative w-full shrink-0">
          <CardMedia
            src={institution.featuredImage ?? institution.coverImage}
            alt={name}
            className="aspect-[16/10] min-h-[220px] w-full"
            imageClassName="transition-transform duration-500 group-hover:scale-105"
            fallback={<Building className="h-16 w-16" />}
          />
          <span className="absolute start-3 top-3 rounded bg-primary px-2 py-1 text-xs font-medium text-white">
            {typeKey ? t(typeKey) : institution.type}
          </span>
        </div>
        <CardContent className="p-5">
          <h3 className="mb-2 text-lg font-bold transition-colors group-hover:text-primary">
            {name}
          </h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            {institution.commune} — {institution.address}
          </p>
          {institution.capacity && (
            <p className="mt-2 text-xs text-muted-foreground">
              {t("institutions.capacityPeople", { count: institution.capacity })}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
