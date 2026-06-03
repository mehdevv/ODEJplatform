import { useEffect } from "react";

const SITE_NAME = "ODEJ بجاية";

export interface SeoMetaOptions {
  title: string;
  description?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeoMeta({
  title,
  description,
  ogImage,
  jsonLd,
}: SeoMetaOptions) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    if (description) {
      setMetaTag("name", "description", description);
      setMetaTag("property", "og:description", description);
    }
    if (title) setMetaTag("property", "og:title", `${title} | ${SITE_NAME}`);
    if (ogImage) setMetaTag("property", "og:image", ogImage);

    const scriptId = "odej-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(
        Array.isArray(jsonLd) ? jsonLd : jsonLd,
      );
    } else if (script) {
      script.remove();
    }

    return () => {
      const s = document.getElementById(scriptId);
      s?.remove();
    };
  }, [title, description, ogImage, jsonLd]);
}

/** @deprecated use useSeoMeta */
export function usePageMeta(title: string, description?: string) {
  useSeoMeta({ title, description });
}
