import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import {
  getWilayaByCode,
  getWilayaLabel,
  WILAYAS,
  type Wilaya,
} from "@/data/wilayas";

const STORAGE_KEY = "odej_wilaya";

type WilayaContextValue = {
  /** Two-digit wilaya code, e.g. "06", or null = all Algeria */
  wilayaCode: string | null;
  wilaya: Wilaya | undefined;
  wilayaLabel: string;
  setWilayaCode: (code: string | null) => void;
  clearWilaya: () => void;
  allWilayas: Wilaya[];
};

const WilayaContext = createContext<WilayaContextValue | null>(null);

function readStored(): string | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v && v.length > 0 ? v.padStart(2, "0") : null;
}

export function WilayaProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [wilayaCode, setWilayaCodeState] = useState<string | null>(readStored);

  const setWilayaCode = useCallback((code: string | null) => {
    const normalized = code ? code.padStart(2, "0") : null;
    setWilayaCodeState(normalized);
    if (normalized) localStorage.setItem(STORAGE_KEY, normalized);
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const clearWilaya = useCallback(() => setWilayaCode(null), [setWilayaCode]);

  const wilaya = useMemo(
    () => getWilayaByCode(wilayaCode),
    [wilayaCode],
  );

  const wilayaLabel = useMemo(() => {
    if (!wilaya) return "";
    return getWilayaLabel(wilaya, i18n.language);
  }, [wilaya, i18n.language]);

  const value = useMemo(
    () => ({
      wilayaCode,
      wilaya,
      wilayaLabel,
      setWilayaCode,
      clearWilaya,
      allWilayas: WILAYAS,
    }),
    [wilayaCode, wilaya, wilayaLabel, setWilayaCode, clearWilaya],
  );

  return (
    <WilayaContext.Provider value={value}>{children}</WilayaContext.Provider>
  );
}

export function useWilaya() {
  const ctx = useContext(WilayaContext);
  if (!ctx) throw new Error("useWilaya must be used within WilayaProvider");
  return ctx;
}

export function useWilayaOptional() {
  return useContext(WilayaContext);
}
