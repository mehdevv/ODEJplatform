import { SiteLayout } from "@/components/layout/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { Search, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function NotFound() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [q, setQ] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) setLocation(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <div className="text-8xl font-bold text-primary/20 mb-4" aria-hidden>
          404
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("notFound.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("notFound.description")}</p>
        <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md mx-auto">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("nav.searchPlaceholder")}
            className="flex-1"
            aria-label={t("nav.search")}
          />
          <Button type="submit" variant="outline" size="icon" aria-label={t("nav.search")}>
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            {t("notFound.backHome")}
          </Button>
        </Link>
      </div>
    </SiteLayout>
  );
}
