import { SiteLayout } from "@/components/layout/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useGlobalSearch } from "@/lib/api";
import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Search as SearchIcon, FileText, Calendar, Building, ArrowLeft, Layout } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";

const POPULAR_SEARCH_KEYS = [
  "search.popularKhilya",
  "search.popularYouthHouse",
  "search.popularSummer",
  "search.popularDiwan",
] as const;
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function SearchResults() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "events" | "institutions" | "pages">("all");
  
  // Update query if URL changes
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q && q !== query) setQuery(q);
  }, [location]);

  const { data: res, isLoading } = useGlobalSearch({
    q: query,
    type: activeTab
  }, {
    query: {
      enabled: query.length > 2
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
      // Force re-render/refetch if needed by updating state
    }
  };

  return (
    <SiteLayout>
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
            <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-primary h-6 w-6" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="pl-4 pr-14 h-16 text-xl rounded-2xl shadow-sm border-primary/20 focus-visible:ring-primary"
            />
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {query.length <= 2 ? (
          <div className="text-center py-20 text-gray-500">
            <SearchIcon className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>{t("search.minChars")}</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : !res || res.total === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed">
            <SearchIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">{t("search.noResults")}</h3>
            <p className="text-muted-foreground mb-6">{t("search.noResultsHint", { query })}</p>
            <p className="text-sm font-medium text-gray-600 mb-3">{t("search.popular")}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCH_KEYS.map((key) => {
                const label = t(key);
                return (
                <Link key={key} href={`/search?q=${encodeURIComponent(label)}`}>
                  <Button variant="outline" size="sm" onClick={() => setQuery(label)}>
                    {label}
                  </Button>
                </Link>
              );})}
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="all">{t("search.tabAll")} ({res.total})</TabsTrigger>
              <TabsTrigger value="articles">{t("search.tabArticles")} ({res.articles?.length || 0})</TabsTrigger>
              <TabsTrigger value="events">{t("search.tabEvents")} ({res.events?.length || 0})</TabsTrigger>
              <TabsTrigger value="institutions">{t("search.tabInstitutions")} ({res.institutions?.length || 0})</TabsTrigger>
              <TabsTrigger value="pages">{t("search.tabPages")} ({res.pages?.length || 0})</TabsTrigger>
            </TabsList>

            <div className="space-y-6">
              {/* Articles */}
              {(activeTab === 'all' || activeTab === 'articles') && res.articles && res.articles.length > 0 && (
                <div className="space-y-4">
                  {activeTab === 'all' && <h3 className="font-bold text-lg border-b pb-2 text-primary">{t("search.sectionArticles")}</h3>}
                  {res.articles.map(item => (
                    <Link key={`art-${item.id}`} href={`/actualites/${item.slug}`}>
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4 flex gap-4">
                          <div className="h-12 w-12 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold group-hover:text-primary transition-colors">{pick(item, "title")}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1 mt-1">{pick(item, "excerpt")}</p>
                          </div>
                          <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-primary self-center hidden sm:block" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Events */}
              {(activeTab === 'all' || activeTab === 'events') && res.events && res.events.length > 0 && (
                <div className="space-y-4">
                  {activeTab === 'all' && <h3 className="font-bold text-lg border-b pb-2 text-primary mt-8">{t("search.sectionEvents")}</h3>}
                  {res.events.map(item => (
                    <Link key={`evt-${item.id}`} href={`/activites/${item.slug}`}>
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4 flex gap-4">
                          <div className="h-12 w-12 rounded bg-accent/10 flex items-center justify-center shrink-0">
                            <Calendar className="h-6 w-6 text-accent" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold group-hover:text-primary transition-colors">{pick(item, "title")}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1 mt-1">{pick(item, "description")}</p>
                          </div>
                          <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-primary self-center hidden sm:block" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {/* Institutions */}
              {(activeTab === 'all' || activeTab === 'institutions') && res.institutions && res.institutions.length > 0 && (
                <div className="space-y-4">
                  {activeTab === 'all' && <h3 className="font-bold text-lg border-b pb-2 text-primary mt-8">{t("search.sectionInstitutions")}</h3>}
                  {res.institutions.map(item => (
                    <Link key={`inst-${item.id}`} href={`/institutions/${item.slug}`}>
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4 flex gap-4">
                          <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center shrink-0">
                            <Building className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold group-hover:text-primary transition-colors">{pick(item, "name")}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1 mt-1">{item.address}، {item.commune}</p>
                          </div>
                          <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-primary self-center hidden sm:block" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {(activeTab === "all" || activeTab === "pages") && res.pages && res.pages.length > 0 && (
                <div className="space-y-4">
                  {activeTab === "all" && <h3 className="font-bold text-lg border-b pb-2 text-primary mt-8">{t("search.sectionPages")}</h3>}
                  {res.pages.map((page) => (
                    <Link key={page.id} href={page.path}>
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                        <CardContent className="p-4 flex gap-4">
                          <div className="h-12 w-12 rounded bg-blue-50 flex items-center justify-center shrink-0">
                            <Layout className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold group-hover:text-primary transition-colors">{pick(page, "title")}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1 mt-1">{pick(page, "excerpt")}</p>
                          </div>
                          <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-primary self-center hidden sm:block" />
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        )}
      </div>
    </SiteLayout>
  );
}
