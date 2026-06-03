import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useGetSiteSettings } from "@/lib/api";
import { useTranslation } from "react-i18next";

export function FooterQr() {
  const { t } = useTranslation();
  const { data: settings } = useGetSiteSettings();
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const url = settings?.siteUrl ?? "https://odejbejaia.dz";
    QRCode.toDataURL(url, { width: 80, margin: 1 })
      .then(setQrUrl)
      .catch(() => setQrUrl(""));
  }, [settings?.siteUrl]);

  return (
    <div className="flex flex-col items-center gap-1">
      {qrUrl ? (
        <img
          src={qrUrl}
          alt="QR code for ODEJ website"
          className="w-20 h-20 rounded-lg bg-white p-1"
        />
      ) : (
        <div className="w-20 h-20 bg-white rounded-lg animate-pulse" aria-hidden />
      )}
      <span className="text-xs text-sidebar-foreground/60">{t("footer.qrHint")}</span>
    </div>
  );
}
