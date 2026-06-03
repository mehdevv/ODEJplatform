import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGlobalSearch } from "@/lib/api";
import { useTranslation } from "react-i18next";
import { useLocalized } from "@/lib/localized-content";
import { cn } from "@/lib/utils";

export function NavbarSearch({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { pick } = useLocalized();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data } = useGlobalSearch(
    { q: query, type: "all" },
    { query: { enabled: query.length > 2 } },
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  const suggestions = [
    ...(data?.articles?.slice(0, 2) ?? []).map((a) => ({
      label: pick(a, "title"),
      href: `/actualites/${a.slug}`,
    })),
    ...(data?.events?.slice(0, 2) ?? []).map((e) => ({
      label: pick(e, "title"),
      href: `/activites/${e.slug}`,
    })),
    ...(data?.institutions?.slice(0, 2) ?? []).map((i) => ({
      label: pick(i, "name"),
      href: `/institutions/${i.slug}`,
    })),
    ...(data?.pages?.slice(0, 2) ?? []).map((p) => ({
      label: pick(p, "title"),
      href: p.path,
    })),
  ];

  return (
    <div ref={ref} className={cn("relative w-36 md:w-40 lg:w-48 xl:w-56", className)}>
      <form onSubmit={submit}>
        <Search className="absolute end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/70 pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("nav.searchPlaceholder")}
          className="h-9 pe-9 ps-3 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-white/30"
          aria-label={t("nav.search")}
        />
      </form>
      {open && query.length > 2 && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white text-foreground rounded-lg shadow-lg border z-50 py-1 max-h-64 overflow-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-start px-3 py-2 text-sm hover:bg-gray-100 truncate"
              onClick={() => {
                setLocation(s.href);
                setOpen(false);
              }}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            className="w-full text-start px-3 py-2 text-sm text-primary font-medium border-t"
            onClick={() => {
              setLocation(`/search?q=${encodeURIComponent(query)}`);
              setOpen(false);
            }}
          >
            {t("nav.search")}: {query}
          </button>
        </div>
      )}
    </div>
  );
}
