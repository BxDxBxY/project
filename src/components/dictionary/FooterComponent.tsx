"use client";
import React from "react";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import TelegramIcon from "@mui/icons-material/Telegram";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { ORGANIZATION } from "@/constants/organization";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";

const linkClass =
  "hover:underline hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a96e] rounded-sm transition-colors";

const socialClass =
  "inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-200 hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a96e] transition-colors";

/** Rasmiy Telegram kanali / Официальный Telegram-канал. */
export const TELEGRAM_CHANNEL = "https://t.me/diplugat";

export default function FooterComponent() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language].footer;
  const org = ORGANIZATION[language];

  if (pathname.startsWith("/admin")) return null;

  const legalLinks = [
    { href: "/terms", label: t.terms },
    { href: "/privacy", label: t.privacy },
    { href: "/cookies", label: t.cookies },
    { href: "/contact", label: t.contact },
  ];

  return (
    <footer className="w-full bg-[#001c3b] text-gray-200 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:gap-12 md:grid-cols-12">
        {/* Tashkilot rekvizitlari */}
        <section aria-labelledby="footer-org" className="md:col-span-6">
          <h2
            id="footer-org"
            className="text-sm font-semibold uppercase tracking-wider text-[#c9a96e] mb-4"
          >
            {t.orgTitle}
          </h2>

          {/*
            Rasmiy nom maʼnoviy boʻlaklarga ajratilgan: bitta uzun qatorda
            oʻqib boʻlmasdi. Ekran oʻqigichlar uchun esa toʻliq nom bitta
            `aria-label` sifatida qoladi.
          */}
          <p
            className="text-sm sm:text-base font-semibold text-white leading-relaxed mb-4"
            aria-label={org.legalName}
          >
            {org.legalNameLines.map((line, index) => (
              <React.Fragment key={line}>
                <span aria-hidden="true">{line}</span>
                {index < org.legalNameLines.length - 1 && (
                  <br aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </p>

          <address className="not-italic text-xs sm:text-sm leading-relaxed space-y-2 text-gray-300">
            <p>
              <span className="text-gray-400">{t.addressLabel}:</span>{" "}
              {org.address}
            </p>
            <p>
              <span className="text-gray-400">{t.phoneLabel}:</span>{" "}
              <a
                href={`tel:${org.phone.replace(/[^+\d]/g, "")}`}
                className={linkClass}
              >
                {org.phone}
              </a>
            </p>
            <p>
              <span className="text-gray-400">{t.emailLabel}:</span>{" "}
              <a href={`mailto:${org.email}`} className={linkClass}>
                {org.email}
              </a>
            </p>
          </address>
        </section>

        {/* Huquqiy hujjatlar */}
        <section aria-labelledby="footer-legal" className="md:col-span-3">
          <h2
            id="footer-legal"
            className="text-sm font-semibold uppercase tracking-wider text-[#c9a96e] mb-4"
          >
            {t.legalTitle}
          </h2>
          <nav aria-label={t.legalTitle}>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <CookieSettingsButton className="text-gray-200 hover:text-white" />
              </li>
            </ul>
          </nav>
        </section>

        {/* Ijtimoiy tarmoqlar */}
        <section aria-labelledby="footer-social" className="md:col-span-3">
          <h2
            id="footer-social"
            className="text-sm font-semibold uppercase tracking-wider text-[#c9a96e] mb-4"
          >
            {t.socialTitle}
          </h2>

          <div className="flex items-center gap-3" role="group">
            <a
              href={TELEGRAM_CHANNEL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.socialTelegram}
              title={t.socialTelegram}
              className={socialClass}
            >
              <TelegramIcon fontSize="small" aria-hidden="true" />
            </a>
            <a
              href="https://x.com/uwedofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.socialX}
              title={t.socialX}
              className={socialClass}
            >
              <XIcon fontSize="small" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/company/UQBc-SSY-DS13uH4Nys8KIJw4bUBXxbhVO7FJAzVrD3S9Pi3-jidu-huzuridagi-diplomatik-akademiya/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.socialLinkedIn}
              title={t.socialLinkedIn}
              className={socialClass}
            >
              <LinkedInIcon fontSize="small" aria-hidden="true" />
            </a>
          </div>

          <a
            href={TELEGRAM_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 inline-block text-xs sm:text-sm text-gray-300 ${linkClass}`}
          >
            t.me/diplugat
          </a>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-white/15 px-4 text-center">
        <p className="text-sm sm:text-base font-semibold text-white tracking-wide">
          {t.siteTitle}
        </p>
        <p className="mt-1 text-xs sm:text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {org.shortName} — {t.rights}
        </p>
      </div>
    </footer>
  );
}
