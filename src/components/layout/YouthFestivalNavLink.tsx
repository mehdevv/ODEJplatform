import { useTranslation } from "react-i18next";
import {
  MAHRAJANI_FESTIVAL_LOGO_SRC,
  MAHRAJANI_FESTIVAL_URL,
} from "@/lib/branding";
import { cn } from "@/lib/utils";

interface YouthFestivalNavLinkProps {
  onClick?: () => void;
  className?: string;
  /** `navbar` = logo only until lg; `drawer` = logo + label always */
  variant?: "navbar" | "drawer";
}

export function YouthFestivalNavLink({
  onClick,
  className,
  variant = "navbar",
}: YouthFestivalNavLinkProps) {
  const { t } = useTranslation();

  return (
    <a
      href={MAHRAJANI_FESTIVAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      title={t("nav.youthFestivalTitle")}
      aria-label={t("nav.youthFestivalTitle")}
      className={cn(
        "group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-1.5 py-1 transition-colors hover:border-secondary/60 hover:bg-white/20",
        className,
      )}
    >
      <img
        src={MAHRAJANI_FESTIVAL_LOGO_SRC}
        alt=""
        className="h-8 w-auto max-w-[4.5rem] object-contain object-center"
        width={72}
        height={32}
        loading="lazy"
        decoding="async"
      />
      <span
        className={cn(
          "text-sm font-medium text-primary-foreground/95 group-hover:text-secondary",
          variant === "drawer"
            ? "inline"
            : "hidden max-w-[5.5rem] truncate lg:inline xl:max-w-none",
        )}
      >
        {t("nav.youthFestival")}
      </span>
    </a>
  );
}
