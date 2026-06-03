/** Deep-merge locale JSON objects (nested keys) */
export function mergeLocales<T extends Record<string, unknown>>(
  base: T,
  extension: Record<string, unknown>,
): T {
  const out = { ...base } as Record<string, unknown>;
  for (const key of Object.keys(extension)) {
    const extVal = extension[key];
    const baseVal = out[key];
    if (
      extVal &&
      typeof extVal === "object" &&
      !Array.isArray(extVal) &&
      baseVal &&
      typeof baseVal === "object" &&
      !Array.isArray(baseVal)
    ) {
      out[key] = mergeLocales(
        baseVal as Record<string, unknown>,
        extVal as Record<string, unknown>,
      );
    } else {
      out[key] = extVal;
    }
  }
  return out as T;
}
