import { SiteLayout } from "@/components/layout/SiteLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListTrainingPrograms } from "@/lib/api";
import { useState } from "react";
import { PageHeader } from "@/components/sections/PageHeader";
import { TrainingProgramCard } from "@/components/cards/TrainingProgramCard";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/Motion";
import { WILAYAS } from "@/data/wilayas";

export default function TrainingCatalog() {
  const { t } = useTranslation();
  usePageMetaI18n("training.pageTitle", "training.pageDesc");
  const [search, setSearch] = useState("");
  const [format, setFormat] = useState("all");
  const [level, setLevel] = useState("all");
  const [wilayaCode, setWilayaCode] = useState("all");
  const [page, setPage] = useState(1);

  const { data: res, isLoading } = useListTrainingPrograms({
    publicOnly: true,
    search: search || undefined,
    format: format !== "all" ? format : undefined,
    level: level !== "all" ? level : undefined,
    wilayaCode: wilayaCode !== "all" ? wilayaCode : undefined,
    page,
    limit: 48,
  });

  const totalPages = res ? Math.ceil(res.total / res.limit) : 0;

  return (
    <SiteLayout>
      <PageHeader
        title={t("training.pageTitle")}
        description={t("training.pageDesc")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/" },
          { label: t("nav.training") },
        ]}
      />
      <FadeIn className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder={t("training.searchPlaceholder")}
              className="pl-4 pr-10 h-12"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={format} onValueChange={(v) => { setFormat(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-[160px] h-12">
              <SelectValue placeholder={t("training.formatLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="workshop">{t("training.format.workshop")}</SelectItem>
              <SelectItem value="course">{t("training.format.course")}</SelectItem>
              <SelectItem value="camp">{t("training.format.camp")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={(v) => { setLevel(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-[160px] h-12">
              <SelectValue placeholder={t("training.levelLabel")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="beginner">{t("training.level.beginner")}</SelectItem>
              <SelectItem value="intermediate">{t("training.level.intermediate")}</SelectItem>
              <SelectItem value="advanced">{t("training.level.advanced")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={wilayaCode} onValueChange={(v) => { setWilayaCode(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-[180px] h-12">
              <SelectValue placeholder={t("training.wilaya")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              {WILAYAS.map((w) => (
                <SelectItem key={w.code} value={w.code}>
                  {w.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-xl" />
            ))}
          </div>
        ) : res?.data.length ? (
          <>
            <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {res.data.map((p) => (
                <StaggerItem key={p.id}>
                  <TrainingProgramCard program={p} />
                </StaggerItem>
              ))}
            </Stagger>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  {t("common.previous")}
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  {t("common.next")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-muted-foreground py-16">{t("training.noPrograms")}</p>
        )}
      </FadeIn>
    </SiteLayout>
  );
}
