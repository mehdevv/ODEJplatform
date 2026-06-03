import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useEmblaCarouselEnhanced } from "@/hooks/useEmblaCarouselEnhanced";
import { easeOut } from "@/lib/motion";

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
        "relative h-[560px] md:h-[600px] overflow-hidden",
        className,
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        ref={emblaRef}
        className="h-full overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y"
      >
        <div
          className="flex h-full"
          style={{ direction: isRtl ? "rtl" : "ltr" }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative h-full min-w-0 flex-[0_0_100%]"
            >
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-primary/30" />
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="container relative z-10 px-4 text-center text-white pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: easeOut }}
            >
              <span className="mb-6 inline-block rounded-full bg-accent px-3 py-1 text-sm font-bold tracking-wide text-accent-foreground shadow-lg">
                {badgeText}
              </span>
              {activeSlide && (
                <>
                  <h1 className="mb-6 whitespace-pre-line text-4xl font-bold leading-tight drop-shadow-md md:text-6xl lg:text-7xl">
                    {activeSlide.title}
                  </h1>
                  {activeSlide.subtitle && (
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-white/90 md:text-xl">
                      {activeSlide.subtitle}
                    </p>
                  )}
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    {activeSlide.ctaHref && activeSlide.ctaLabel && (
                      <Link href={activeSlide.ctaHref}>
                        <Button
                          size="lg"
                          className="h-14 w-full bg-white px-8 text-lg text-primary shadow-xl hover:bg-gray-100 sm:w-auto"
                        >
                          {activeSlide.ctaLabel}
                        </Button>
                      </Link>
                    )}
                    {activeSlide.secondaryCtaHref &&
                      activeSlide.secondaryCtaLabel && (
                        <Link href={activeSlide.secondaryCtaHref}>
                          <Button
                            size="lg"
                            variant="outline"
                            className="h-14 w-full border-2 border-white px-8 text-lg text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto"
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
        className="absolute bottom-6 start-1/2 z-20 flex -translate-x-1/2 gap-2 rtl:translate-x-1/2"
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
