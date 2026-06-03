import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardMediaProps {
  src?: string | null;
  alt?: string;
  fallback?: ReactNode;
  /** e.g. aspect-[16/10] min-h-[200px] or h-52 */
  className?: string;
  imageClassName?: string;
}

/** Full-bleed cover image for cards — fills the media container */
export function CardMedia({
  src,
  alt = "",
  fallback,
  className,
  imageClassName,
}: CardMediaProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-muted shrink-0",
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-center",
            imageClassName,
          )}
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary text-primary/30">
          {fallback}
        </div>
      )}
    </div>
  );
}
