"use client";
import React from "react";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import XIcon from "@mui/icons-material/X";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/constants/translations";
import { ORGANIZATION, isPlaceholder } from "@/constants/organization";
import { CookieSettingsButton } from "@/components/ui/CookieConsent";

const linkClass =
  "hover:underline hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a96e] rounded-sm transition-colors";

/** Toʻldirilmagan rekvizit saytda koʻrinib turishi kerak, lekin ajratib koʻrsatiladi. */
const DetailValue: React.FC<{ value: string }> = ({ value }) =>
  isPlaceholder(value) ? (
    <mark className="bg-amber-200 text-amber-950 px-1 rounded">{value}</mark>
  ) : (
    <>{value}</>
  );

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
    { href: "/refund", label: t.refund },
    { href: "/contact", label: t.contact },
  ];

  return (
    <footer className="w-full bg-[#001c3b] text-gray-200 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-3">
        {/* Tashkilot rekvizitlari */}
        <section aria-labelledby="footer-org" className="md:col-span-2">
          <h2
            id="footer-org"
            className="text-sm font-semibold uppercase tracking-wider text-[#c9a96e] mb-3"
          >
            {t.orgTitle}
          </h2>
          <address className="not-italic text-xs sm:text-sm leading-relaxed space-y-1">
            <p className="font-medium text-white">{org.legalName}</p>
            <p>
              {t.addressLabel}: {org.address}
            </p>
            <p>
              {t.phoneLabel}:{" "}
              <a href={`tel:${org.phone.replace(/[^+\d]/g, "")}`} className={linkClass}>
                {org.phone}
              </a>
            </p>
            <p>
              {t.emailLabel}:{" "}
              <a href={`mailto:${org.email}`} className={linkClass}>
                {org.email}
              </a>
            </p>
            <p>
              {t.taxIdLabel}: <DetailValue value={org.taxId} />
            </p>
          </address>
        </section>

        {/* Huquqiy hujjatlar */}
        <section aria-labelledby="footer-legal">
          <h2
            id="footer-legal"
            className="text-sm font-semibold uppercase tracking-wider text-[#c9a96e] mb-3"
          >
            {t.legalTitle}
          </h2>
          <nav aria-label={t.legalTitle}>
            <ul className="space-y-2 text-xs sm:text-sm">
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

          <h2
            className="text-sm font-semibold uppercase tracking-wider text-[#c9a96e] mt-6 mb-3"
            id="footer-social"
          >
            {t.socialTitle}
          </h2>
          <div
            className="flex items-center gap-5"
            role="group"
            aria-labelledby="footer-social"
          >
            <a
              href="https://x.com/uwedofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.socialX}
              className={`inline-flex p-1 ${linkClass}`}
            >
              <XIcon fontSize="small" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/company/UQBc-SSY-DS13uH4Nys8KIJw4bUBXxbhVO7FJAzVrD3S9Pi3-jidu-huzuridagi-diplomatik-akademiya/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.socialLinkedIn}
              className={`inline-flex p-1 ${linkClass}`}
            >
              <LinkedInIcon fontSize="small" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-white/15 text-center text-xs sm:text-sm text-gray-300 px-4">
        &copy; {new Date().getFullYear()} {org.shortName} — {t.rights}
      </div>
    </footer>
  );
}
