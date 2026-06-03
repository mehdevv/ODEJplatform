import { SiteLayout } from "@/components/layout/SiteLayout";
import { useGetArticle, getGetArticleQueryKey, useGetRelatedArticles } from "@/lib/api";
import { useParams, Link } from "wouter";
import { Calendar, Clock, User, ArrowRight, FileText, Share2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { articleJsonLd } from "@/lib/jsonLd";
import { NewsCard } from "@/components/cards/NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";

const CATEGORY_KEYS: Record<string, string> = {
  "أخبار": "news.catNews",
  "رياضة": "news.catSports",
  "ثقافة": "news.catCulture",
  "صحة": "news.catHealth",
};

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { pick, dateLocale } = useLocalized();

  const { data: article, isLoading } = useGetArticle(slug ?? "", {
    query: {
      enabled: !!slug,
      queryKey: getGetArticleQueryKey(slug)
    }
  });

  const { data: related } = useGetRelatedArticles(slug, {
    query: {
      enabled: !!slug,
    }
  });

  useSeoMeta({
    title: article?.seoTitle || (article ? pick(article, "title") : t("news.detailFallback")),
    description: article?.seoDesc || (article ? pick(article, "excerpt") : undefined),
    ogImage: article?.featuredImage,
    jsonLd: article ? articleJsonLd(article) : undefined,
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-8 w-24 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-3/4 mb-8" />
          <Skeleton className="h-64 w-full mb-8 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </SiteLayout>
    );
  }

  const share = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: t("news.linkCopied") });
    });
  };

  if (!article && !isLoading) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-700">{t("news.notFound")}</h2>
          <Link href="/actualites">
            <Button className="mt-4">{t("news.backToList")}</Button>
          </Link>
        </div>
      </SiteLayout>
    );
  }

  if (!article) return null;

  const title = pick(article, "title");
  const excerpt = pick(article, "excerpt");
  const categoryKey = article.categoryNameAr
    ? CATEGORY_KEYS[article.categoryNameAr]
    : undefined;

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/actualites" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 font-medium">
          <ArrowRight className="h-4 w-4" /> {t("news.backToList")}
        </Link>
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded text-sm font-bold">
              {categoryKey ? t(categoryKey) : t("news.categoryFallback")}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-y py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' }) : t("news.draft")}</span>
            </div>
            {article.authorName && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.authorName}</span>
              </div>
            )}
            {(article.readingTimeMinutes ?? article.readingTime) && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{t("news.readingTime", { count: article.readingTimeMinutes ?? article.readingTime })}</span>
              </div>
            )}
            
            <div className="ms-auto flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 gap-2" onClick={share} type="button">
                <Link2 className="h-4 w-4" /> {t("news.copyLink")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-2"
                asChild
              >
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Share2 className="h-4 w-4" /> Facebook
                </a>
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="relative mb-10 aspect-[21/9] min-h-[280px] max-h-[500px] w-full overflow-hidden rounded-xl bg-gray-100 shadow-md">
            <img
              src={article.featuredImage}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </div>
        )}

        {/* Content */}
        <article className="prose prose-lg max-w-none text-gray-800 prose-headings:text-primary prose-a:text-accent font-sans leading-loose mb-16">
          {excerpt && (
            <p className="text-xl font-medium text-gray-600 border-r-4 border-accent pr-4 mb-8">
              {excerpt}
            </p>
          )}
          
          {/* Simple render of body - in a real app might use a markdown renderer */}
          <div dangerouslySetInnerHTML={{ __html: article.body || '' }} />
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {article.tags.map((tag, i) => (
              <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related */}
        {related && related.length > 0 && (
          <section className="border-t pt-12 mt-12">
            <h3 className="text-2xl font-bold mb-6">{t("news.related")}</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.slice(0, 2).map((rel) => (
                <NewsCard key={rel.id} article={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
