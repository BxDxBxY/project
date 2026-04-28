import { fetchTerms } from "@/lib/termsApi";
import DictionaryClient from "./DictionaryClient";
import { TermSummary } from "@/types";
import { logger } from "@/lib/utils";

export const revalidate = 3600; // Revalidate every hour

export default async function DictionaryServerPage() {
  let initialTerms: TermSummary[] = [];
  try {
    initialTerms = await fetchTerms();
  } catch (error) {
    logger.error("Failed to fetch initial terms for SSR:", error);
  }

  return <DictionaryClient initialTerms={initialTerms} />;
}
