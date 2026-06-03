import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useListArticles } from "@/lib/api";
import {
  ArrowLeft,
  Building,
  Activity,
  Users,
  MapPin,
  HeartHandshake,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { HeroCarousel } from "@/components/sections/HeroCarousel";
import { NewsCard } from "@/components/cards/NewsCard";
import { ScrollCarousel } from "@/components/carousel/ScrollCarousel";
import { FadeIn, Stagger, StaggerItem, MotionCard } from "@/components/motion/Motion";
import { useTranslation } from "react-i18next";
import { usePageMetaI18n } from "@/hooks/usePageMetaI18n";
import { WilayaMapExplorer } from "@/components/map/WilayaMapExplorer";
import { WILAYAS } from "@/data/wilayas";
import { MOCK_IMG } from "@/lib/mock-images";
import { cn } from "@/lib/utils";

const CATEGORY_ITEMS = [
  { titleKey: "home.catYouthHouses", icon: Building, count: "12" },
  { titleKey: "home.catMiniPitches", icon: Activity, count: "45" },
  { titleKey: "home.catCulture", icon: Users, count: "8" },
  { titleKey: "home.catCamps", icon: MapPin, count: "3" },
  { titleKey: "home.catYouthClubs", icon: Building, count: "24" },
] as const;

const sectionPad = "py-10 sm:py-14 md:py-20";
const containerPx = "px-3 sm:px-4";

export default function Home() {
  const { t } = useTranslation();
  usePageMetaI18n("meta.homeTitle", "meta.homeDesc");

  const { data: articlesRes, isLoading: isLoadingArticles } = useListArticles({
    status: "published",
    limit: 12,
  });

  const heroSlides = [
    {
      image: "/images/hero1.png",
      title: t("home.hero1Title"),
      subtitle: t("home.hero1Subtitle"),
      ctaLabel: t("home.exploreInstitutions"),
      ctaHref: "/institutions",
      secondaryCtaLabel: t("home.upcomingActivities"),
      secondaryCtaHref: "/activites",
    },
    {
      image: "/images/hero2.png",
      title: t("home.hero2Title"),
      subtitle: t("home.hero2Subtitle"),
      ctaLabel: t("home.hero2Cta"),
      ctaHref: "/khilya",
    },
    {
      image: "/images/hero3.png",
      title: t("home.hero3Title"),
      subtitle: t("home.hero3Subtitle"),
      ctaLabel: t("home.hero3Cta"),
      ctaHref: "/diwan",
    },
  ];

  return (
    <SiteLayout>
      <div className="overflow-x-hidden">
        <HeroCarousel slides={heroSlides} />

        <FadeIn className={cn(sectionPad, "border-b bg-gradient-to-b from-primary/10 to-white")}>
          <div className={cn("container mx-auto", containerPx)}>
            <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-10">
              <h2 className="mb-2 text-2xl font-bold text-primary sm:mb-4 sm:text-3xl md:text-4xl">
                {t("wilaya.mapSectionTitle")}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                {t("wilaya.mapSectionSubtitle", { count: WILAYAS.length })}
              </p>
            </div>
            <WilayaMapExplorer className="mx-auto max-w-6xl" syncContext />
          </div>
        </FadeIn>

        <FadeIn className={cn(sectionPad, "bg-surface")}>
          <div className={cn("container mx-auto", containerPx)}>
            <Card className="overflow-hidden border-0 bg-primary text-white shadow-xl">
              <div className="grid gap-0 md:grid-cols-3">
                <div className="flex flex-col justify-center p-5 sm:p-8 md:col-span-2 md:p-12">
                  <h2 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">
                    {t("home.directorTitle")}
                  </h2>
                  <p className="mb-5 text-base font-medium italic leading-relaxed opacity-90 sm:mb-6 sm:text-lg">
                    &ldquo;{t("home.directorQuote")}&rdquo;
                  </p>
                  <div className="mt-auto">
                    <div className="text-lg font-bold sm:text-xl">
                      {t("home.directorRole")}
                    </div>
                    <div className="text-secondary">{t("home.directorRegion")}</div>
                  </div>
                </div>
                <div className="relative min-h-[180px] bg-primary-dark sm:min-h-[220px] md:h-auto md:min-h-[200px]">
                  <img
                    src={MOCK_IMG.leadership}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity"
                    loading="lazy"
                  />
                </div>
              </div>
            </Card>
          </div>
        </FadeIn>

        <FadeIn className={sectionPad}>
          <div className={cn("container mx-auto", containerPx)}>
            <div className="mb-8 text-center sm:mb-12">
              <h2 className="mb-2 text-2xl font-bold text-primary sm:mb-4 sm:text-3xl">
                {t("home.categoriesTitle")}
              </h2>
              <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
                {t("home.institutionsSubtitle")}
              </p>
            </div>

            <ScrollCarousel
              className="-mx-1 sm:mx-0"
              slideClassName="min-w-0 shrink-0 grow-0 basis-[82%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%]"
              autoPlay
              autoPlayDelay={4000}
              dragFree
              loop
            >
              {CATEGORY_ITEMS.map((cat, i) => (
                <Link key={i} href="/institutions">
                  <MotionCard>
                    <Card className="h-full cursor-pointer border-transparent text-center shadow-sm hover-elevate">
                      <CardContent className="flex flex-col items-center gap-3 pb-5 pt-5 sm:gap-4 sm:pb-6 sm:pt-6">
                        <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary sm:mb-2 sm:h-16 sm:w-16">
                          <cat.icon className="h-7 w-7 sm:h-8 sm:w-8" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 sm:text-base">
                            {t(cat.titleKey)}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                            {t("home.institutionCount", { count: cat.count })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </MotionCard>
                </Link>
              ))}
            </ScrollCarousel>
          </div>
        </FadeIn>

        <FadeIn className={cn(sectionPad, "border-y bg-gray-50")}>
          <div className={cn("container mx-auto", containerPx)}>
            <div className="mb-8 flex flex-col gap-3 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h2 className="mb-1 text-2xl font-bold text-primary sm:mb-2 sm:text-3xl">
                  {t("home.latestNews")}
                </h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                  {t("home.newsSubtitle")}
                </p>
              </div>
              <Link href="/actualites" className="hidden shrink-0 sm:block">
                <Button variant="outline" className="flex items-center gap-2">
                  {t("home.viewAllNews")}
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {isLoadingArticles ? (
              <div className="-mx-1 flex gap-3 overflow-hidden sm:mx-0 sm:gap-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card
                      key={i}
                      className="min-w-[min(100%,280px)] shrink-0 overflow-hidden sm:min-w-[280px]"
                    >
                      <Skeleton className="h-36 w-full sm:h-48" />
                      <CardContent className="space-y-3 p-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-full" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <ScrollCarousel
                className="-mx-1 sm:mx-0"
                slideClassName="min-w-0 shrink-0 grow-0 basis-[90%] sm:basis-[48%] lg:basis-[32%]"
                autoPlay
                autoPlayDelay={5000}
                dragFree
                loop
                showDots
              >
                {articlesRes?.data?.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </ScrollCarousel>
            )}

            <div className="mt-6 text-center sm:hidden">
              <Link href="/actualites">
                <Button variant="outline" className="w-full max-w-sm">
                  {t("home.viewAllNews")}
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>

        <FadeIn className={sectionPad}>
          <Stagger className={cn("container mx-auto grid gap-5 px-3 sm:gap-8 sm:px-4 md:grid-cols-2")}>
            <StaggerItem>
              <Card className="h-full overflow-hidden border-secondary bg-secondary/50 transition-shadow hover:shadow-lg">
                <CardContent className="p-6 sm:p-10">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm sm:mb-6 sm:h-16 sm:w-16">
                    <HeartHandshake className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold text-primary sm:mb-4 sm:text-3xl">
                    {t("home.khilyaTitle")}
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-gray-700 sm:mb-8 sm:text-base">
                    {t("home.khilyaDesc")}
                  </p>
                  <Link href="/khilya">
                    <Button className="w-full bg-primary text-white hover:bg-primary-dark sm:w-auto">
                      {t("home.khilyaCta")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card className="h-full overflow-hidden border-0 bg-primary text-white transition-shadow hover:shadow-lg">
                <CardContent className="relative z-10 p-6 sm:p-10">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-white shadow-sm backdrop-blur sm:mb-6 sm:h-16 sm:w-16">
                    <Users className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl">
                    {t("home.diwanTitle")}
                  </h2>
                  <p className="mb-6 text-sm leading-relaxed text-white/90 sm:mb-8 sm:text-base">
                    {t("home.diwanDesc")}
                  </p>
                  <Link href="/diwan">
                    <Button
                      variant="secondary"
                      className="w-full font-bold text-primary sm:w-auto"
                    >
                      {t("home.diwanCta")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </StaggerItem>
          </Stagger>
        </FadeIn>
      </div>
    </SiteLayout>
  );
}
