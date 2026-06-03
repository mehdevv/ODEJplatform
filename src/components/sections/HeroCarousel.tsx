import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useEmblaCarouselEnhanced } from "@/hooks/useEmblaCarouselEnhanced";
import { easeOut } from "@/lib/motion";
import { ODEJ_LOGO_ALT_AR, ODEJ_LOGO_SRC } from "@/lib/branding";

export interface HeroSlide {
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  className?: string;
  badge?: string;
}

export function HeroCarousel({ slides, className, badge }: HeroCarouselProps) {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.dir() === "rtl";

  const { emblaRef, selectedIndex, isDragging, scrollTo } = useEmblaCarouselEnhanced({
    options: {
      loop: true,
      direction: isRtl ? "rtl" : "ltr",
      align: "start",
    },
    autoPlay: true,
    autoPlayDelay: 5500,
    dragFree: false,
    pauseOnHover: true,
  });

  const badgeText = badge ?? t("home.heroBadge");
  const activeSlide = slides[selectedIndex];

  return (
    <section
      key={isRtl ? "hero-rtl" : "hero-ltr"}
      className={cn(
        "relative overflow-hidden",
        /* Mobile/tablet: fill viewport below sticky header (h-14 / md:h-16) */
        "h-[calc(100dvh-3.5rem)] min-h-[calc(100dvh-3.5rem)]",
        "md:h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-4rem)]",
        "lg:h-[600px] lg:min-h-0",
        className,
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        ref={emblaRef}
        className="absolute inset-0 size-full overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
      >
        <div
          className="flex h-full min-h-0"
          style={{ direction: isRtl ? "rtl" : "ltr", height: "100%" }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative h-full min-h-0 min-w-0 flex-[0_0_100%] overflow-hidden"
            >
              {/* Overscaled cover so tall phones never show empty bands at top/bottom */}
              <img
                src={slide.image}
                alt=""
                className={cn(
                  "pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 object-cover",
                  "h-full w-full min-h-full min-w-full",
                  "max-md:h-[130%] max-md:w-[130%] max-md:object-bottom",
                  "md:object-center",
                )}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: ODEJ logo in top half of hero */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-1/2 items-center justify-center px-4 pt-2 md:hidden"
      >
        <div className="flex flex-col items-center gap-2.5 text-center">
          <img
            src={ODEJ_LOGO_SRC}
            alt={ODEJ_LOGO_ALT_AR}
            className="h-[7.5rem] w-[7.5rem] rounded-full object-cover bg-white shadow-2xl ring-[5px] ring-white/50 sm:h-36 sm:w-36"
            width={144}
            height={144}
            decoding="async"
          />
          <p className="max-w-[18rem] text-lg font-bold leading-snug text-white drop-shadow-lg sm:text-xl">
            {t("brand")}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex flex-col justify-center md:justify-center",
          "pb-[max(4.5rem,env(safe-area-inset-bottom,0px)+3.5rem)] md:pb-0",
        )}
      >
        <div
          className={cn(
            "container relative flex max-h-full flex-col px-3 text-center text-white pointer-events-auto sm:px-4",
            "mt-auto h-1/2 justify-center sm:max-w-none",
            "max-w-lg md:mx-auto md:mt-0 md:h-auto md:justify-center",
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              <span className="mb-3 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold tracking-wide text-accent-foreground shadow-lg sm:mb-6 sm:px-3 sm:py-1 sm:text-sm">
                {badgeText}
              </span>
              {activeSlide && (
                <>
                  <h1 className="mb-3 whitespace-pre-line text-[1.65rem] font-bold leading-snug drop-shadow-md sm:mb-6 sm:text-4xl sm:leading-tight md:text-6xl lg:text-7xl">
                    {activeSlide.title}
                  </h1>
                  {activeSlide.subtitle && (
                    <p className="mx-auto mb-5 max-w-2xl text-sm leading-relaxed text-white/90 sm:mb-10 sm:text-lg md:text-xl">
                      {activeSlide.subtitle}
                    </p>
                  )}
                  <div className="flex w-full max-w-sm flex-col items-stretch justify-center gap-2.5 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
                    {activeSlide.ctaHref && activeSlide.ctaLabel && (
                      <Link href={activeSlide.ctaHref} className="w-full sm:w-auto">
                        <Button
                          size="lg"
                          className="h-11 w-full bg-white px-5 text-base text-primary shadow-xl hover:bg-gray-100 sm:h-14 sm:px-8 sm:text-lg"
                        >
                          {activeSlide.ctaLabel}
                        </Button>
                      </Link>
                    )}
                    {activeSlide.secondaryCtaHref &&
                      activeSlide.secondaryCtaLabel && (
                        <Link
                          href={activeSlide.secondaryCtaHref}
                          className="w-full sm:w-auto"
                        >
                          <Button
                            size="lg"
                            variant="outline"
                            className="h-11 w-full border-2 border-white px-5 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:h-14 sm:px-8 sm:text-lg"
                          >
                            {activeSlide.secondaryCtaLabel}
                          </Button>
                        </Link>
                      )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div
        className="absolute bottom-[max(1rem,env(safe-area-inset-bottom,0px))] start-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-6 rtl:translate-x-1/2"
        role="tablist"
        aria-label={t("home.heroSlides")}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === selectedIndex}
            aria-label={`${t("home.heroSlide")} ${i + 1}`}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              i === selectedIndex
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80",
            )}
            onClick={() => scrollTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
