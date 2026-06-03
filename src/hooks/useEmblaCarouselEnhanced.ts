import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaOptionsType } from "embla-carousel";

export interface UseEmblaCarouselEnhancedOptions {
  options?: EmblaOptionsType;
  dragFree?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  pauseOnHover?: boolean;
  stopAutoPlayOnInteraction?: boolean;
}

export function useEmblaCarouselEnhanced({
  options = {},
  dragFree = false,
  autoPlay = false,
  autoPlayDelay = 5000,
  pauseOnHover = true,
  stopAutoPlayOnInteraction = true,
}: UseEmblaCarouselEnhancedOptions = {}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: autoPlayDelay,
        stopOnInteraction: stopAutoPlayOnInteraction,
        stopOnMouseEnter: pauseOnHover,
        playOnInit: autoPlay,
      }),
    [autoPlay, autoPlayDelay, pauseOnHover, stopAutoPlayOnInteraction],
  );

  const plugins = autoPlay ? [autoplayPlugin] : [];

  const [emblaRefInner, emblaApi] = useEmblaCarousel(
    {
      ...options,
      dragFree: dragFree ?? options.dragFree,
      watchDrag: true,
    },
    plugins,
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const onDown = () => rootRef.current?.classList.add("embla__is-dragging");
    const onUp = () => rootRef.current?.classList.remove("embla__is-dragging");
    emblaApi.on("pointerDown", onDown);
    emblaApi.on("pointerUp", onUp);
    return () => {
      emblaApi.off("pointerDown", onDown);
      emblaApi.off("pointerUp", onUp);
    };
  }, [emblaApi]);

  const emblaRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      emblaRefInner(node);
    },
    [emblaRefInner],
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return {
    emblaRef,
    emblaApi,
    selectedIndex,
    scrollTo,
    scrollPrev,
    scrollNext,
  };
}
