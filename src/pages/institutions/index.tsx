import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListInstitutions } from "@/lib/api";
import { useState, useEffect } from "react";
import { useWilaya } from "@/contexts/WilayaContext";
import { Building, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/sections/PageHeader";
import { InstitutionCard } from "@/components/cards/InstitutionCard";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/Motion";

export default function InstitutionsDirectory() {
  const { t } = useTranslation();
  const { wilayaCode, setWilayaCode, wilayaLabel } = useWilaya();
  usePageMetaI18n("institutions.pageTitle", "institutions.pageDesc");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const w = params.get("wilaya");
    if (w) setWilayaCode(w.padStart(2, "0"));
  }, [setWilayaCode]);

  const { data: res, isLoading } = useListInstitutions({
    search,
    type: type !== "all" ? type : undefined,
    wilayaCode: wilayaCode ?? undefined,
    page,
    limit: 48,
  });

  const totalPages = res ? Math.ceil(res.total / res.limit) : 0;

  return (
    <SiteLayout>
      <PageHeader
        title={
          wilayaLabel
            ? t("institutions.pageTitleWilaya", { wilaya: wilayaLabel })
            : t("institutions.pageTitle")
        }
        description={
          wilayaLabel
            ? t("institutions.heroDescWilaya", { wilaya: wilayaLabel })
            : t("institutions.heroDesc")
        }
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.institutions") },
        ]}
      />

      <FadeIn className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder={t("institutions.searchPlaceholder")} 
              className="pl-4 pr-10 h-12"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-[200px] h-12">
              <SelectValue placeholder={t("institutions.typeFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("institutions.filterAll")}</SelectItem>
              <SelectItem value="youth_house">{t("institutions.typeYouthHouse")}</SelectItem>
              <SelectItem value="culture_center">{t("institutions.typeCulture")}</SelectItem>
              <SelectItem value="sports_complex">{t("institutions.typeSports")}</SelectItem>
              <SelectItem value="camp">{t("institutions.typeCamp")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : res?.data && res.data.length > 0 ? (
          <>
            <Stagger className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {res.data.map((inst) => (
                <StaggerItem key={inst.id}>
                  <InstitutionCard
                    institution={{
                      ...inst,
                      featuredImage: inst.coverImage || inst.featuredImage,
                    }}
                  />
                </StaggerItem>
              ))}
            </Stagger>
            
            {res.total > res.limit && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {t("common.prev")}
                </Button>
                <span className="text-sm font-medium">
                  {t("common.pageOf", { page, total: totalPages })}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                >
                  {t("common.next")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
            <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">{t("institutions.emptyTitle")}</h3>
            <p className="text-muted-foreground">{t("institutions.emptyDesc")}</p>
          </div>
        )}
      </FadeIn>
    </SiteLayout>
  );
}
