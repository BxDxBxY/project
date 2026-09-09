import DictionaryClient from "./DictionaryClient";
import { TermSummary } from "@/types";
import { logger } from "@/lib/utils";

export const revalidate = 3600; // Revalidate every hour

// Fetch terms directly from the backend on the server.
// The browser `apiClient` uses a relative "/api" baseURL, which is not a valid
// URL in a Node server component — hence this dedicated absolute-URL fetch.
async function fetchTermsForSSR(): Promise<TermSummary[]> {
  const base = process.env.BACKEND_URL;
  if (!base) {
    logger.error("BACKEND_URL is not set — skipping SSR term fetch");
    return [];
  }
  const res = await fetch(`${base}/dictionary/term/`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`Backend responded with ${res.status}`);
  }
  return (await res.json()) as TermSummary[];
}

export default async function DictionaryServerPage() {
  let initialTerms: TermSummary[] = [];
  try {
    initialTerms = await fetchTermsForSSR();
  } catch (error) {
    logger.error("Failed to fetch initial terms for SSR:", error);
  }

  return <DictionaryClient initialTerms={initialTerms} />;
}
