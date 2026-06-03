import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CardMedia } from "@/components/ui/card-media";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";
import type { Article } from "@/lib/api";

const CATEGORY_KEYS: Record<string, string> = {
  "أخبار": "news.catNews",
  "رياضة": "news.catSports",
  "ثقافة": "news.catCulture",
  "صحة": "news.catHealth",
};

interface NewsCardProps {
  article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
  const { t } = useTranslation();
  const { pick, dateLocale } = useLocalized();
  const title = pick(article, "title");
  const excerpt = pick(article, "excerpt");
  const categoryKey = article.categoryNameAr
    ? CATEGORY_KEYS[article.categoryNameAr]
    : undefined;

  return (
    <Link href={`/actualites/${article.slug}`}>
      <Card className="group flex h-full cursor-pointer flex-col overflow-hidden border-transparent shadow-sm transition-all hover:shadow-md hover-elevate">
        <CardMedia
          src={article.featuredImage}
          alt={title}
          className="aspect-[16/10] min-h-[200px] w-full"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
          fallback={<FileText className="h-12 w-12" />}
        />
        <CardContent className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-primary/10 px-2 py-1 font-medium text-primary">
              {categoryKey ? t(categoryKey) : t("news.categoryFallback")}
            </span>
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString(dateLocale)
                : ""}
            </span>
          </div>
          <h3 className="mb-2 line-clamp-2 text-lg font-bold transition-colors group-hover:text-primary">
            {title}
          </h3>
          {excerpt && (
            <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
              {excerpt}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
