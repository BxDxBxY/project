import { Metadata } from "next";

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  ogImage = "/og-image.png",
  canonical,
}: SEOConfig): Metadata {
  const siteName = "Diplomatic Dictionary - Dip Lugat";
  const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Diplomatic Academy of Uzbekistan" }],
    openGraph: {
      title: fullTitle,
      description,
      images: [ogImage],
      type: "website",
      siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    ...(canonical && { alternates: { canonical } }),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export const defaultSEO: SEOConfig = {
  title: "Diplomatic Dictionary - Dip Lugat",
  description:
    "Comprehensive diplomatic dictionary in Uzbek, English, and Russian. The first scientific diplomatic terminology dictionary in Central Asia.",
  keywords: [
    "diplomatic dictionary",
    "dip lugat",
    "diplomatik lug'at",
    "diplomatic terms",
    "international relations",
    "uzbekistan",
    "diplomatic academy",
    "foreign affairs",
    "diplomacy",
  ],
};
