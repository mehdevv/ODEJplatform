import { Children, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEmblaCarouselEnhanced } from "@/hooks/useEmblaCarouselEnhanced";
import type { EmblaOptionsType } from "embla-carousel";
import { useTranslation } from "react-i18next";

export interface ScrollCarouselProps {
  children: ReactNode;
  className?: string;
  viewportClassName?: string;
  /** Tailwind basis per slide, e.g. "basis-full md:basis-1/2 lg:basis-1/3" */
  slideClassName?: string;
  options?: EmblaOptionsType;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  dragFree?: boolean;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  gapClassName?: string;
}

export function ScrollCarousel({
  children,
  className,
  viewportClassName,
  slideClassName = "min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3",
  options,
  autoPlay = true,
  autoPlayDelay = 4500,
  dragFree = true,
  loop = true,
  showArrows = true,
  showDots = false,
  gapClassName = "-ml-4",
}: ScrollCarouselProps) {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const {
    emblaRef,
    selectedIndex,
    isDragging,
    scrollTo,
    scrollPrev,
    scrollNext,
  } = useEmblaCarouselEnhanced({
    options: {
      loop,
      align: "start",
      direction: isRtl ? "rtl" : "ltr",
      ...options,
    },
    dragFree,
    autoPlay,
    autoPlayDelay,
    pauseOnHover: true,
  });

  const slides = Children.toArray(children);
  const slideCount = slides.length;

  return (
    <div
      className={cn(
        "embla-carousel group/carousel relative",
        isDragging && "embla__is-dragging",
        className,
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        ref={emblaRef}
        className={cn(
          "overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y",
          viewportClassName,
        )}
      >
        <div
          className={cn("flex", gapClassName)}
          style={{ direction: isRtl ? "rtl" : "ltr" }}
        >
          {slides.map((slide, i) => (
            <div key={i} className={cn(slideClassName, "pl-4")}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrows && slideCount > 1 && (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute start-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full shadow-md opacity-0 transition-opacity group-hover/carousel:opacity-100 focus:opacity-100"
            onClick={scrollPrev}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute end-2 top-1/2 z-10 h-10 w-10 -translate-y-1/2 rounded-full shadow-md opacity-0 transition-opacity group-hover/carousel:opacity-100 focus:opacity-100"
            onClick={scrollNext}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 rtl:rotate-180" />
          </Button>
        </>
      )}

      {showDots && slideCount > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selectedIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/50",
              )}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
