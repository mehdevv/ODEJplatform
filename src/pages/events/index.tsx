import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListEvents } from "@/lib/api";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/sections/PageHeader";
import { EventCard } from "@/components/cards/EventCard";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { Link } from "wouter";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/Motion";
import { ScrollCarousel } from "@/components/carousel/ScrollCarousel";

export default function EventsActivities() {
  const { t } = useTranslation();
  const { pick, dateLocale } = useLocalized();
  usePageMetaI18n("events.pageTitle", "events.pageDesc");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "calendar">("list");

  const { data: res, isLoading } = useListEvents({
    search,
    status: 'published',
    category: category !== "all" ? category : undefined,
    page,
    limit: 48
  });

  const calendarDays = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startPad = first.getDay();
    const days: (number | null)[] = Array(startPad).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return { days, month, year, events: res?.data ?? [] };
  }, [res?.data]);

  const totalPages = res ? Math.ceil(res.total / res.limit) : 0;

  return (
    <SiteLayout>
      <PageHeader
        title={t("events.pageTitle")}
        description={t("events.heroDesc")}
        breadcrumbs={[{ label: t("nav.home"), href: "/" }, { label: t("nav.activities") }]}
      />

      <FadeIn className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")}>
            {t("events.viewList")}
          </Button>
          <Button variant={view === "calendar" ? "default" : "outline"} onClick={() => setView("calendar")}>
            {t("events.viewCalendar")}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              placeholder={t("events.searchPlaceholder")} 
              className="pl-4 pr-10 h-12"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-[200px] h-12">
              <SelectValue placeholder={t("common.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="رياضة">{t("events.filterSports")}</SelectItem>
              <SelectItem value="ثقافة">{t("events.filterCulture")}</SelectItem>
              <SelectItem value="تكوين">{t("events.filterTraining")}</SelectItem>
              <SelectItem value="ترفيه">{t("events.filterLeisure")}</SelectItem>
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
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : res?.data && res.data.length > 0 ? (
          <>
            {view === "calendar" ? (
              <Card className="mb-8 p-6">
                <h3 className="font-bold text-lg mb-4 text-primary">
                  {new Date(calendarDays.year, calendarDays.month).toLocaleDateString(dateLocale, { month: "long", year: "numeric" })}
                </h3>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {["أ", "ث", "أ", "خ", "ج", "س", "ح"].map((d, i) => (
                    <div key={i} className="font-bold text-muted-foreground py-2">{d}</div>
                  ))}
                  {calendarDays.days.map((day, i) => {
                    const dayEvents = day
                      ? calendarDays.events.filter((e) => new Date(e.startDate).getDate() === day)
                      : [];
                    return (
                      <div
                        key={i}
                        className={`min-h-16 p-1 border rounded-md ${day ? "bg-white" : "bg-transparent border-transparent"}`}
                      >
                        {day && <span className="text-xs font-medium">{day}</span>}
                        {dayEvents.slice(0, 2).map((e) => (
                          <Link key={e.id} href={`/activites/${e.slug}`}>
                            <div className="text-[10px] bg-primary/10 text-primary rounded px-1 mt-0.5 truncate">
                              {pick(e, "title")}
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </Card>
            ) : null}
            {view === "list" ? (
              <ScrollCarousel
                className="mb-8 md:hidden"
                slideClassName="min-w-0 shrink-0 grow-0 basis-[92%]"
                autoPlay
                autoPlayDelay={5000}
                dragFree
                loop
                showDots
              >
                {res.data.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </ScrollCarousel>
            ) : null}
            <Stagger className="mb-8 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
              {res.data.map((event) => (
                <StaggerItem key={event.id}>
                  <EventCard event={event} />
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
            <CalendarIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">{t("events.emptyTitle")}</h3>
            <p className="text-muted-foreground">{t("events.emptyDesc")}</p>
          </div>
        )}
      </FadeIn>
    </SiteLayout>
  );
}
