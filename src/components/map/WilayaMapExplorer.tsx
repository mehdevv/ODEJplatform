import { useState } from "react";
import { cn } from "@/lib/utils";
import { AlgeriaWilayaMap } from "@/components/map/AlgeriaWilayaMap";
import { WilayaDetailPanel } from "@/components/map/WilayaDetailPanel";
import { useWilayaOptional } from "@/contexts/WilayaContext";

interface WilayaMapExplorerProps {
  className?: string;
  syncContext?: boolean;
}

export function WilayaMapExplorer({
  className,
  syncContext = true,
}: WilayaMapExplorerProps) {
  const wilayaCtx = useWilayaOptional();
  const [hoverCode, setHoverCode] = useState<string | null>(null);

  const activeCode =
    hoverCode ?? (syncContext ? wilayaCtx?.wilayaCode ?? null : null);
  const isPreview = !!hoverCode && hoverCode !== wilayaCtx?.wilayaCode;

  const panelMinH =
    "min-h-[240px] sm:min-h-[320px] lg:min-h-[min(720px,85vh)]";

  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,400px)] lg:items-stretch",
        className,
      )}
    >
      <AlgeriaWilayaMap
        syncContext={syncContext}
        showFooter={false}
        fillHeight
        onWilayaHover={setHoverCode}
        className={cn("min-w-0", panelMinH)}
      />

      <WilayaDetailPanel
        wilayaCode={activeCode}
        isPreview={isPreview}
        className={cn("lg:sticky lg:top-24", panelMinH, !activeCode && panelMinH)}
      />
    </div>
  );
}
