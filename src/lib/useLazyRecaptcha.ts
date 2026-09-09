"use client";

import { useCallback, useRef } from "react";

interface GrecaptchaApi {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaApi;
  }
}

const SCRIPT_ID = "google-recaptcha-v3";

/**
 * Google reCAPTCHA v3 ni faqat kerak boʻlganda yuklaydi.
 *
 * Maqsad: foydalanuvchi formaga tegmagunicha Google skriptlari sahifaga
 * umuman yuklanmaydi — bu maʼlumotlarni minimallashtirish talabiga mos keladi.
 */
export const useLazyRecaptcha = (siteKey: string | undefined) => {
  const loaderRef = useRef<Promise<void> | null>(null);

  const load = useCallback((): Promise<void> => {
    if (!siteKey) return Promise.reject(new Error("reCAPTCHA site key missing"));
    if (typeof window === "undefined") return Promise.resolve();
    if (loaderRef.current) return loaderRef.current;

    loaderRef.current = new Promise<void>((resolve, reject) => {
      const existing = document.getElementById(SCRIPT_ID);
      if (existing && window.grecaptcha) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loaderRef.current = null;
        reject(new Error("Failed to load reCAPTCHA"));
      };
      document.head.appendChild(script);
    });

    return loaderRef.current;
  }, [siteKey]);

  /** Foydalanuvchi formani toʻldirishni boshlaganda oldindan yuklab qoʻyish. */
  const prepare = useCallback(() => {
    load().catch(() => {
      /* yuklanmasa, yuborish paytida qayta urinib koʻriladi */
    });
  }, [load]);

  const execute = useCallback(
    async (action: string): Promise<string> => {
      await load();
      const grecaptcha = window.grecaptcha;
      if (!grecaptcha) throw new Error("reCAPTCHA is not available");

      await new Promise<void>((resolve) => grecaptcha.ready(() => resolve()));
      return grecaptcha.execute(siteKey as string, { action });
    },
    [load, siteKey],
  );

  return { prepare, execute, isConfigured: Boolean(siteKey) };
};
