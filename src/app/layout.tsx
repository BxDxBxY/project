import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeaderDefault } from "@/components/dictionary/HeaderDefault";
import FooterComponent from "@/components/dictionary/FooterComponent";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ConsentProvider } from "@/lib/ConsentContext";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { ConsentedAnalytics } from "@/components/analytics/ConsentedAnalytics";
import { SkipToContentLink } from "@/components/ui/SkipToContentLink";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Diplomatik izohli lugʻat",
  description:
    "Diplomatiya va xalqaro munosabatlar terminlarining izohli lugʻati. Толковый словарь дипломатических терминов.",
  keywords: [
    "diplomatik lugʻat",
    "diplomatiya terminlari",
    "xalqaro munosabatlar",
    "дипломатический словарь",
    "международные отношения",
  ],
  authors: [{ name: "Diplomatik akademiya" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Sahifa tili LanguageProvider tomonidan tanlangan tilga moslanadi.
  return (
    <html lang="uz">
      <body className={inter.className}>
        <LanguageProvider>
          <ConsentProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <SkipToContentLink />

              {/* Fixed header */}
              <HeaderDefault />

              {/* Main content area — only vertical gap, pages own their width */}
              <main
                id="main-content"
                tabIndex={-1}
                className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 outline-none"
              >
                {children}
              </main>

              {/* Sticky footer */}
              <FooterComponent />
            </div>

            <CookieConsent />
            {/* Statistika faqat rozilikdan keyin yuklanadi */}
            <ConsentedAnalytics />
          </ConsentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
