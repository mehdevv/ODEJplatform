import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { getWilayaByCode, getWilayaLabel } from "@/data/wilayas";
import { useWilayaOptional } from "@/contexts/WilayaContext";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";

const MAP_URL = "/maps/algeria-69-wilayas.svg";

interface AlgeriaWilayaMapProps {
  className?: string;
  /** Highlight and sync with global wilaya context */
  syncContext?: boolean;
  /** Bottom info bar (hidden when using WilayaMapExplorer side panel) */
  showFooter?: boolean;
  /** Stretch SVG to match adjacent panel height */
  fillHeight?: boolean;
  onWilayaHover?: (code: string | null) => void;
  onWilayaSelect?: (code: string) => void;
}

export function AlgeriaWilayaMap({
  className,
  syncContext = true,
  showFooter = true,
  fillHeight = false,
  onWilayaHover,
  onWilayaSelect,
}: AlgeriaWilayaMapProps) {
  const { t, i18n } = useTranslation();
  const wilayaCtx = useWilayaOptional();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverCode, setHoverCode] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const activeCode =
    hoverCode ?? (syncContext ? wilayaCtx?.wilayaCode ?? null : null);

  const applyPathStyles = useCallback(() => {
    const root = containerRef.current?.querySelector("#algeria-map-69-wilaya");
    if (!root) return;
    const paths = root.querySelectorAll<SVGPathElement>("path[id]");
    paths.forEach((path) => {
      const id = path.id.padStart(2, "0");
      const isActive =
        id === activeCode?.padStart(2, "0") ||
        id === wilayaCtx?.wilayaCode?.padStart(2, "0");
      const isHover = id === hoverCode?.padStart(2, "0");
      path.classList.toggle("wilaya-active", isActive);
      path.classList.toggle("wilaya-hover", isHover && !isActive);
    });
  }, [activeCode, hoverCode, wilayaCtx?.wilayaCode]);

  useEffect(() => {
    applyPathStyles();
  }, [applyPathStyles]);

  useEffect(() => {
    let cancelled = false;
    fetch(MAP_URL)
      .then((r) => {
        if (!r.ok) throw new Error("map load failed");
        return r.text();
      })
      .then((svg) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    const container = containerRef.current;
    const root = container.querySelector("#algeria-map-69-wilaya");
    if (!root) return;

    const handleOver = (e: Event) => {
      const target = (e.target as Element).closest("path[id]");
      if (!target) return;
      const code = (target as SVGPathElement).id.padStart(2, "0");
      setHoverCode(code);
      onWilayaHover?.(code);
    };

    const handleOut = (e: Event) => {
      const related = (e as MouseEvent).relatedTarget as Node | null;
      if (related && root.contains(related)) return;
      setHoverCode(null);
      onWilayaHover?.(null);
    };

    const handleClick = (e: Event) => {
      const target = (e.target as Element).closest("path[id]");
      if (!target) return;
      const code = (target as SVGPathElement).id.padStart(2, "0");
      if (syncContext && wilayaCtx) wilayaCtx.setWilayaCode(code);
      onWilayaSelect?.(code);
    };

    root.addEventListener("mouseover", handleOver);
    root.addEventListener("mouseout", handleOut);
    root.addEventListener("click", handleClick);

    applyPathStyles();

    return () => {
      root.removeEventListener("mouseover", handleOver);
      root.removeEventListener("mouseout", handleOut);
      root.removeEventListener("click", handleClick);
    };
  }, [
    loaded,
    syncContext,
    wilayaCtx,
    onWilayaHover,
    onWilayaSelect,
    applyPathStyles,
  ]);

  const displayWilaya = getWilayaByCode(
    hoverCode ?? wilayaCtx?.wilayaCode ?? null,
  );
  const displayLabel = displayWilaya
    ? getWilayaLabel(displayWilaya, i18n.language)
    : null;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border border-primary/10 bg-white/50 p-3 shadow-sm",
        fillHeight && "min-h-[min(720px,85vh)]",
        className,
      )}
    >
      <style>{`
        #algeria-map-69-wilaya path[id] {
          fill: #1e6b3a;
          stroke: #ffffff;
          stroke-width: 2;
          cursor: pointer;
          transition: fill 0.2s ease, filter 0.2s ease;
        }
        #algeria-map-69-wilaya path[id].wilaya-hover {
          fill: #2ecc71;
          filter: brightness(1.1);
        }
        #algeria-map-69-wilaya path[id].wilaya-active {
          fill: #27ae60;
          stroke: #f1c40f;
          stroke-width: 3;
          filter: drop-shadow(0 0 6px rgba(46, 204, 113, 0.6));
        }
        #algeria-map-69-wilaya {
          width: 100%;
          height: auto;
          max-height: ${fillHeight ? "none" : "520px"};
        }
        .algeria-map-viewport--fill #algeria-map-69-wilaya {
          height: 100%;
          max-height: 100%;
          width: auto;
          max-width: 100%;
          margin: 0 auto;
        }
      `}</style>

      {error ? (
        <p className="text-center text-muted-foreground py-12">
          {t("wilaya.mapLoadError")}
        </p>
      ) : (
        <div
          ref={containerRef}
          className={cn(
            "w-full flex-1 flex items-center justify-center min-h-0",
            fillHeight && "algeria-map-viewport--fill [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:max-w-full",
            !fillHeight && "[&_svg]:mx-auto [&_svg]:max-w-full",
          )}
          role="img"
          aria-label={t("wilaya.mapAria")}
        />
      )}

      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5 rounded-xl">
          <span className="text-sm text-muted-foreground">{t("common.loading")}</span>
        </div>
      )}

      {showFooter && (
      <div
        className={cn(
          "mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border bg-white/90 p-4 shadow-sm backdrop-blur min-h-[4.5rem]",
          !displayLabel && "justify-center",
        )}
      >
        {displayLabel ? (
          <>
            <div className="flex items-center gap-3 text-center sm:text-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {hoverCode ? t("wilaya.hovering") : t("wilaya.selected")}
                </p>
                <p className="text-xl font-bold text-primary">{displayLabel}</p>
                <p className="text-sm text-muted-foreground">
                  {t("wilaya.codeLabel", {
                    code: displayWilaya?.code,
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href={`/institutions?wilaya=${displayWilaya?.code}`}
              >
                <Button size="sm">{t("wilaya.exploreWilaya")}</Button>
              </Link>
              {wilayaCtx?.wilayaCode && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => wilayaCtx.clearWilaya()}
                  className="gap-1"
                >
                  <X className="h-4 w-4" />
                  {t("wilaya.clearFilter")}
                </Button>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            {t("wilaya.mapHint")}
          </p>
        )}
      </div>
      )}
    </div>
  );
}
