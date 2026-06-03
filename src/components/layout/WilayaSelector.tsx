import { useTranslation } from "react-i18next";
import { useWilaya } from "@/contexts/WilayaContext";
import { getWilayaLabel, WILAYAS } from "@/data/wilayas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";

export function WilayaSelector({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const { wilayaCode, setWilayaCode } = useWilaya();

  return (
    <Select
      value={wilayaCode ?? "all"}
      onValueChange={(v) => setWilayaCode(v === "all" ? null : v)}
    >
      <SelectTrigger
        className={className}
        aria-label={t("wilaya.selectWilaya")}
      >
        <MapPin className="h-4 w-4 shrink-0 opacity-70" />
        <SelectValue placeholder={t("wilaya.allAlgeria")} />
      </SelectTrigger>
      <SelectContent className="max-h-[min(24rem,70vh)]">
        <SelectItem value="all">{t("wilaya.allAlgeria")}</SelectItem>
        {WILAYAS.map((w) => (
          <SelectItem key={w.code} value={w.code}>
            {w.code} — {getWilayaLabel(w, i18n.language)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
