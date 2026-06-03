import { useTranslation } from "react-i18next";
import { usePageMeta } from "@/hooks/usePageMeta";

export function usePageMetaI18n(titleKey: string, descriptionKey?: string) {
  const { t } = useTranslation();
  usePageMeta(t(titleKey), descriptionKey ? t(descriptionKey) : undefined);
}
