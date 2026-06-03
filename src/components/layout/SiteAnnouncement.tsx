import { useGetSiteSettings } from "@/lib/api";
import { X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SiteAnnouncement() {
  const { t } = useTranslation();
  const { data: settings } = useGetSiteSettings();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || !settings?.announcementBanner?.enabled) return null;
  const text = settings.announcementBanner.text;
  if (!text) return null;

  return (
    <div
      role="alert"
      className="bg-accent text-white px-4 py-2 text-sm text-center relative"
    >
      <p className="pe-8">{text}</p>
      <button
        type="button"
        className="absolute end-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20"
        onClick={() => setDismissed(true)}
        aria-label={t("announcement.close")}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
