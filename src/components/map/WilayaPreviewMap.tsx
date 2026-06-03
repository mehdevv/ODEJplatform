import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAlgeriaMapSvg } from "@/hooks/useAlgeriaMapSvg";
import { getWilayaByCode, getWilayaLabel } from "@/data/wilayas";

interface WilayaPreviewMapProps {
  wilayaCode: string;
  className?: string;
}

function findWilayaPath(doc: Document, code: string): SVGPathElement | null {
  const padded = code.padStart(2, "0");
  const unpadded = String(parseInt(code, 10));
  const root = doc.querySelector("#algeria-map-69-wilaya") ?? doc.documentElement;
  return (
    root.querySelector<SVGPathElement>(`path[id="${padded}"]`) ??
    root.querySelector<SVGPathElement>(`path[id="${unpadded}"]`)
  );
}

export function WilayaPreviewMap({ wilayaCode, className }: WilayaPreviewMapProps) {
  const { t, i18n } = useTranslation();
  const { svg, loading, error } = useAlgeriaMapSvg();
  const containerRef = useRef<HTMLDivElement>(null);

  const wilaya = getWilayaByCode(wilayaCode);
  const label = wilaya ? getWilayaLabel(wilaya, i18n.language) : wilayaCode;

  useEffect(() => {
    if (!svg || !containerRef.current) return;

    const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
    const sourcePath = findWilayaPath(doc, wilayaCode);
    if (!sourcePath) {
      containerRef.current.innerHTML = "";
      return;
    }

    const path = sourcePath.cloneNode(true) as SVGPathElement;
    path.removeAttribute("class");
    path.setAttribute("fill", "#1e6b3a");
    path.setAttribute("stroke", "#ffffff");
    path.setAttribute("stroke-width", "24");

    const measureSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    measureSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    measureSvg.style.position = "absolute";
    measureSvg.style.visibility = "hidden";
    measureSvg.style.pointerEvents = "none";
    measureSvg.appendChild(path);
    document.body.appendChild(measureSvg);

    let viewBox = "0 0 100 100";
    try {
      const bbox = path.getBBox();
      const pad = Math.max(bbox.width, bbox.height) * 0.12 || 40;
      viewBox = `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`;
    } catch {
      /* getBBox can fail in rare cases */
    }
    document.body.removeChild(measureSvg);

    const preview = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    preview.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    preview.setAttribute("viewBox", viewBox);
    preview.setAttribute("class", "wilaya-preview-svg h-full w-full");
    preview.setAttribute("role", "img");
    preview.setAttribute("aria-label", t("wilaya.detailMapAria", { name: label }));
    preview.appendChild(path);

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(preview);
  }, [svg, wilayaCode, label, t]);

  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] min-h-[180px] items-center justify-center rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-4",
        className,
      )}
    >
      {loading && (
        <span className="text-sm text-muted-foreground">{t("common.loading")}</span>
      )}
      {error && (
        <span className="text-sm text-muted-foreground">{t("wilaya.mapLoadError")}</span>
      )}
      <div ref={containerRef} className="h-full w-full max-h-[220px]" />
    </div>
  );
}
