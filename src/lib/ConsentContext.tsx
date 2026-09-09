"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

export const CONSENT_COOKIE_NAME = "cookie_consent";
const CONSENT_COOKIE_DAYS = 365;

/** Saqlanadigan qiymatlar / сохраняемые значения. */
export type ConsentChoice = "all" | "necessary";

interface ConsentContextProps {
  /** Statistika cookie-fayllariga ruxsat berilganmi. */
  analyticsAllowed: boolean;
  /** Foydalanuvchi tanlov qilganmi (banner koʻrsatilishi shu bilan bogʻliq). */
  decided: boolean;
  /** Banner hozir koʻrinishi kerakmi. */
  bannerVisible: boolean;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  /** Tanlovni qayta koʻrib chiqish uchun bannerni ochish. */
  openSettings: () => void;
}

const ConsentContext = createContext<ConsentContextProps | undefined>(undefined);

/** Google Analytics oʻrnatgan cookie-fayllarni imkon qadar oʻchiradi. */
const clearAnalyticsCookies = () => {
  if (typeof document === "undefined") return;

  const gaCookies = document.cookie
    .split(";")
    .map((entry) => entry.split("=")[0]?.trim())
    .filter((name): name is string =>
      Boolean(name && (name === "_ga" || name.startsWith("_ga_"))),
    );

  const { hostname } = window.location;
  // Cookie domen darajasida ham oʻrnatilgan boʻlishi mumkin.
  const domains = [undefined, hostname, `.${hostname}`];

  gaCookies.forEach((name) => {
    domains.forEach((domain) => {
      Cookies.remove(name, domain ? { path: "/", domain } : { path: "/" });
    });
  });
};

export const ConsentProvider = ({ children }: { children: ReactNode }) => {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const saved = Cookies.get(CONSENT_COOKIE_NAME);
    if (saved === "all" || saved === "necessary") {
      setChoice(saved);
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((value: ConsentChoice) => {
    Cookies.set(CONSENT_COOKIE_NAME, value, {
      expires: CONSENT_COOKIE_DAYS,
      path: "/",
      sameSite: "Lax",
      secure:
        typeof window !== "undefined" && window.location.protocol === "https:",
    });
    setChoice(value);
    setSettingsOpen(false);
  }, []);

  const acceptAll = useCallback(() => persist("all"), [persist]);

  const acceptNecessaryOnly = useCallback(() => {
    const wasAllowed = choice === "all";
    persist("necessary");
    clearAnalyticsCookies();
    // Statistika skripti allaqachon yuklangan boʻlsa, uni toʻxtatishning
    // ishonchli yoʻli — sahifani qayta yuklash.
    if (wasAllowed && typeof window !== "undefined") {
      window.location.reload();
    }
  }, [choice, persist]);

  const openSettings = useCallback(() => setSettingsOpen(true), []);

  const value = useMemo<ConsentContextProps>(
    () => ({
      analyticsAllowed: choice === "all",
      decided: choice !== null,
      // SSR paytida banner koʻrsatilmaydi — bu gidratatsiya farqining oldini oladi.
      bannerVisible: hydrated && (choice === null || settingsOpen),
      acceptAll,
      acceptNecessaryOnly,
      openSettings,
    }),
    [choice, hydrated, settingsOpen, acceptAll, acceptNecessaryOnly, openSettings],
  );

  return (
    <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
  );
};

export const useConsent = (): ConsentContextProps => {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
};
