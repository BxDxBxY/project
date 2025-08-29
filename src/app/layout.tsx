import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head"; // Import Head component from next/head
import { HeaderDefault } from "@/components/dictionary/HeaderDefault";
import FooterComponent from "@/components/dictionary/FooterComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diplomatic Dictionary",
  description: "A comprehensive dictionary of diplomatic terms and concepts",
  keywords: [
    "diplomatic",
    "dictionary",
    "terms",
    "foreign affairs",
    "international relations",
  ],
  authors: [{ name: "Diplomatic Academy" }],
  // Do not include viewport here anymore
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>

          {/* Fixed header */}
          <HeaderDefault />

          {/* Main content with padding for fixed header */}
          <main
            className={`flex-1 bg-gradient-to-b from-gray-50  to-gray-100 `}
          >
            {children}
          </main>

          {/* Sticky footer */}
          <FooterComponent />
        </div>
      </body>
    </html>
  );
}
