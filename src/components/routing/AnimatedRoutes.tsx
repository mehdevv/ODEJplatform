import { AnimatePresence } from "framer-motion";
import { PageMotion } from "@/components/motion/Motion";
import { useLocaleLocation } from "@/components/routing/LocaleRouter";
import type { ReactNode } from "react";

export function AnimatedRoutes({ children }: { children: ReactNode }) {
  const [location] = useLocaleLocation();

  return (
    <AnimatePresence mode="wait">
      <PageMotion key={location} className="flex flex-1 flex-col min-h-0">
        {children}
      </PageMotion>
    </AnimatePresence>
  );
}
