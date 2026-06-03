import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { CardMedia } from "@/components/ui/card-media";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewsCard } from "@/components/cards/NewsCard";
import { useListArticles } from "@/lib/api";
import { useState } from "react";
import { Link } from "wouter";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useLocalized } from "@/lib/localized-content";

export default function NewsHub() {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  usePageMeta(t("news.title"), t("news.subtitle"));
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data: res, isLoading } = useListArticles({
    status: "published",
    category: category !== "all" ? category : undefined,
    page,
    limit: 48,
  });

  const categories = [
    { id: "all", label: t("news.allCategories") },
    { id: "أخبار", label: t("news.catNews") },
    { id: "رياضة", label: t("news.catSports") },
    { id: "ثقافة", label: t("news.catCulture") },
    { id: "صحة", label: t("news.catHealth") },
  ];

  const featured = res?.data?.[0];
  const gridArticles = res?.data?.slice(featured ? 1 : 0) ?? [];

  return (
    <SiteLayout>
      <div className="border-b bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
            {t("news.title")}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {t("news.subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setPage(1);
          }}
          className="mb-8 w-full"
        >
          <TabsList className="flex h-14 w-full flex-nowrap justify-start overflow-x-auto overflow-y-hidden rounded-lg border bg-gray-100 p-1">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="whitespace-nowrap rounded-md px-6 py-2.5 text-base transition-all data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[16/10] min-h-[200px] w-full" />
                  <CardContent className="space-y-3 p-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : res?.data && res.data.length > 0 ? (
          <>
            {featured && category === "all" && page === 1 && (
              <Link href={`/actualites/${featured.slug}`} className="mb-10 block">
                <Card className="overflow-hidden border-0 shadow-xl hover-elevate">
                  <div className="grid md:grid-cols-2">
                    <CardMedia
                      src={featured.featuredImage}
                      alt={pick(featured, "title")}
                      className="aspect-[16/10] min-h-[280px] w-full md:aspect-auto md:min-h-[320px]"
                      fallback={<FileText className="h-16 w-16" />}
                    />
                    <CardContent className="flex flex-col justify-center p-8">
                      <span className="mb-2 text-sm font-bold text-accent">
                        {t("news.featured")}
                      </span>
                      <h2 className="mb-3 text-2xl font-bold text-primary md:text-3xl">
                        {pick(featured, "title")}
                      </h2>
                      <p className="line-clamp-3 text-muted-foreground">
                        {pick(featured, "excerpt")}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            )}
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(category === "all" && page === 1 ? gridArticles : res.data).map(
                (article) => (
                  <NewsCard key={article.id} article={article} />
                ),
              )}
            </div>

            {res.total > res.limit && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {t("common.prev")}
                </Button>
                <span className="text-sm font-medium">
                  {t("common.pageOf", {
                    page,
                    total: Math.ceil(res.total / res.limit),
                  })}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(res.total / res.limit)}
                >
                  {t("common.next")}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed bg-gray-50 py-20 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-bold text-gray-700">
              {t("news.emptyTitle")}
            </h3>
            <p className="text-muted-foreground">{t("news.emptyDesc")}</p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
