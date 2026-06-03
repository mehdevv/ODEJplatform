import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Building, MapPin, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WilayaStreetMap } from "@/components/map/WilayaStreetMap";
import { getWilayaByCode, getWilayaLabel } from "@/data/wilayas";
import { useWilayaOptional } from "@/contexts/WilayaContext";
import { useListInstitutions } from "@/lib/api";
import { useLocalized } from "@/lib/localized-content";
import type { Institution } from "@/lib/api";

const TYPE_KEYS: Record<string, string> = {
  youth_house: "institutions.typeYouthHouse",
  culture_center: "institutions.typeCulture",
  sports_complex: "institutions.typeSports",
  camp: "institutions.typeCamp",
};

interface WilayaDetailPanelProps {
  wilayaCode: string | null;
  isPreview?: boolean;
  className?: string;
}

function OfficeRow({ institution }: { institution: Institution }) {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const name = pick(institution, "name");
  const typeKey = TYPE_KEYS[institution.type];

  return (
    <Link href={`/institutions/${institution.slug}`}>
      <article className="group flex gap-3 rounded-lg border bg-white p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-sm group-hover:text-primary">{name}</h4>
          <p className="text-xs text-muted-foreground">
            {typeKey ? t(typeKey) : institution.type}
          </p>
          {(institution.commune || institution.address) && (
            <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="line-clamp-2">
                {[institution.commune, institution.address].filter(Boolean).join(" — ")}
              </span>
            </p>
          )}
          {institution.phone && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 shrink-0" />
              <span dir="ltr">{institution.phone}</span>
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

export function WilayaDetailPanel({
  wilayaCode,
  isPreview = false,
  className,
}: WilayaDetailPanelProps) {
  const { t, i18n } = useTranslation();
  const wilayaCtx = useWilayaOptional();
  const wilaya = getWilayaByCode(wilayaCode);
  const label = wilaya ? getWilayaLabel(wilaya, i18n.language) : null;

  const { data: res, isLoading } = useListInstitutions(
    { wilayaCode: wilayaCode ?? undefined, limit: 50 },
    { query: { enabled: !!wilayaCode } },
  );

  const offices = res?.data ?? [];

  if (!wilayaCode || !wilaya) {
    return (
      <aside
        className={cn(
          "flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/30 p-8 text-center",
          className,
        )}
      >
        <MapPin className="mb-4 h-12 w-12 text-primary/30" />
        <p className="max-w-xs text-sm text-muted-foreground">{t("wilaya.selectToSeeOffices")}</p>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "flex max-h-[min(720px,85vh)] flex-col overflow-hidden rounded-2xl border bg-white shadow-lg",
        className,
      )}
    >
      <div className="shrink-0 border-b bg-primary/5 p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {isPreview ? t("wilaya.hovering") : t("wilaya.selected")}
            </p>
            <h3 className="text-xl font-bold text-primary">{label}</h3>
            <p className="text-sm text-muted-foreground">
              {t("wilaya.codeLabel", { code: wilaya.code })}
            </p>
          </div>
          {!isPreview && wilayaCtx?.wilayaCode && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => wilayaCtx.clearWilaya()}
              aria-label={t("wilaya.clearFilter")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <WilayaStreetMap
          wilayaCode={wilayaCode}
          institutions={offices}
          className="mt-4"
          heightClassName="h-[240px]"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
          <h4 className="font-semibold text-gray-900">{t("wilaya.officesTitle")}</h4>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {isLoading ? "…" : t("wilaya.officeCount", { count: offices.length })}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
            </div>
          ) : offices.length > 0 ? (
            <ul className="space-y-2">
              {offices.map((inst) => (
                <li key={inst.id}>
                  <OfficeRow institution={inst} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("wilaya.officesEmpty")}
            </p>
          )}
        </div>

        <div className="shrink-0 flex flex-wrap gap-2 border-t bg-gray-50/80 p-4">
          <Link href={`/institutions?wilaya=${wilaya.code}`} className="flex-1 min-w-[140px]">
            <Button className="w-full" size="sm">
              {t("wilaya.exploreWilaya")}
            </Button>
          </Link>
          {!isPreview && wilayaCtx?.wilayaCode && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => wilayaCtx.clearWilaya()}
            >
              <X className="h-4 w-4" />
              {t("wilaya.clearFilter")}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}
