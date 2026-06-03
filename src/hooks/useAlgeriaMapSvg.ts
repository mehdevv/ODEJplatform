import { useEffect, useState } from "react";

const MAP_URL = "/maps/algeria-69-wilayas.svg";

let cachedSvg: string | null = null;
let loadPromise: Promise<string> | null = null;

function loadMapSvg(): Promise<string> {
  if (cachedSvg) return Promise.resolve(cachedSvg);
  if (!loadPromise) {
    loadPromise = fetch(MAP_URL).then((r) => {
      if (!r.ok) throw new Error("map load failed");
      return r.text();
    }).then((text) => {
      cachedSvg = text;
      return text;
    });
  }
  return loadPromise;
}

export function useAlgeriaMapSvg() {
  const [svg, setSvg] = useState<string | null>(cachedSvg);
  const [loading, setLoading] = useState(!cachedSvg);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cachedSvg) {
      setSvg(cachedSvg);
      setLoading(false);
      return;
    }
    let cancelled = false;
    loadMapSvg()
      .then((text) => {
        if (!cancelled) {
          setSvg(text);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { svg, loading, error };
}
