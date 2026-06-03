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
import { MOCK_HERO, MOCK_IMG } from "@/lib/mock-images";

const CATEGORY_ITEMS = [
  { titleKey: "home.catYouthHouses", icon: Building, count: "12" },
  { titleKey: "home.catMiniPitches", icon: Activity, count: "45" },
  { titleKey: "home.catCulture", icon: Users, count: "8" },
  { titleKey: "home.catCamps", icon: MapPin, count: "3" },
  { titleKey: "home.catYouthClubs", icon: Building, count: "24" },
] as const;

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
      <HeroCarousel slides={heroSlides} />

      <FadeIn className="py-16 md:py-20 bg-gradient-to-b from-primary/10 to-white border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {t("wilaya.mapSectionTitle")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("wilaya.mapSectionSubtitle", { count: WILAYAS.length })}
            </p>
          </div>
          <WilayaMapExplorer className="mx-auto max-w-6xl" syncContext />
        </div>
      </FadeIn>

      <FadeIn className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <Card className="border-0 shadow-xl overflow-hidden bg-primary text-white">
            <div className="grid md:grid-cols-3 gap-0">
              <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6">{t("home.directorTitle")}</h2>
                <p className="text-lg leading-relaxed opacity-90 mb-6 font-medium italic">
                  &ldquo;{t("home.directorQuote")}&rdquo;
                </p>
                <div className="mt-auto">
                  <div className="font-bold text-xl">{t("home.directorRole")}</div>
                  <div className="text-secondary">{t("home.directorRegion")}</div>
                </div>
              </div>
              <div className="h-64 md:h-auto bg-primary-dark relative min-h-[200px]">
                <img
                  src={MOCK_IMG.leadership}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-40"
                  loading="lazy"
                />
              </div>
            </div>
          </Card>
        </div>
      </FadeIn>

      <FadeIn className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              {t("home.categoriesTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("home.institutionsSubtitle")}
            </p>
          </div>

          <ScrollCarousel
            slideClassName="min-w-0 shrink-0 grow-0 basis-[72%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%]"
            autoPlay
            autoPlayDelay={4000}
            dragFree
            loop
          >
            {CATEGORY_ITEMS.map((cat, i) => (
              <Link key={i} href="/institutions">
                <MotionCard>
                  <Card className="hover-elevate cursor-pointer border-transparent shadow-sm text-center h-full">
                    <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-primary mb-2">
                        <cat.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{t(cat.titleKey)}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
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

      <FadeIn className="py-20 bg-gray-50 border-y">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2">
                {t("home.latestNews")}
              </h2>
              <p className="text-muted-foreground">{t("home.newsSubtitle")}</p>
            </div>
            <Link href="/actualites">
              <Button
                variant="outline"
                className="hidden sm:flex items-center gap-2"
              >
                {t("home.viewAllNews")}
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoadingArticles ? (
            <div className="flex gap-4 overflow-hidden">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i} className="min-w-[280px] overflow-hidden shrink-0">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-full" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <ScrollCarousel
              slideClassName="min-w-0 shrink-0 grow-0 basis-[88%] sm:basis-[48%] lg:basis-[32%]"
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

          <div className="mt-8 text-center sm:hidden">
            <Link href="/actualites">
              <Button variant="outline" className="w-full">
                {t("home.viewAllNews")}
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>

      <FadeIn className="py-20">
        <Stagger className="container mx-auto grid gap-8 px-4 md:grid-cols-2">
          <StaggerItem>
            <Card className="bg-secondary/50 border-secondary overflow-hidden hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-8 sm:p-10">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-primary mb-6 shadow-sm">
                  <HeartHandshake className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold text-primary mb-4">
                  {t("home.khilyaTitle")}
                </h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                  {t("home.khilyaDesc")}
                </p>
                <Link href="/khilya">
                  <Button className="bg-primary hover:bg-primary-dark text-white">
                    {t("home.khilyaCta")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="bg-primary text-white overflow-hidden hover:shadow-lg transition-shadow border-0 h-full">
              <CardContent className="p-8 sm:p-10 relative z-10">
                <div className="h-16 w-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm">
                  <Users className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-bold mb-4">{t("home.diwanTitle")}</h2>
                <p className="text-white/90 mb-8 leading-relaxed">
                  {t("home.diwanDesc")}
                </p>
                <Link href="/diwan">
                  <Button variant="secondary" className="text-primary font-bold">
                    {t("home.diwanCta")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </StaggerItem>
        </Stagger>
      </FadeIn>
    </SiteLayout>
  );
}
