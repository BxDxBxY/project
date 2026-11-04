import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchTerm } from "@/lib/termsApi";
import { TermDetail } from "@/types";
import { logger } from "@/lib/utils";
import { isApiError } from "@/lib/apiErrors";
import TermClient from "./TermClient";

/**
 * Server half of a term page.
 *
 * The page used to be a client component that fetched on mount, so every
 * visitor got a spinner first and search engines got an empty document — for
 * a dictionary, where the individual entries *are* the content, that threw
 * away the whole point of publishing it. Fetching here means the definition
 * is in the first byte of HTML, and `generateMetadata` can give each term a
 * real title and description.
 *
 * Rendering is on demand rather than prerendered: 1191 entries would make a
 * slow build, and editors expect a change in the panel to show up at once.
 */

interface TermPageProps {
  params: Promise<{ word: string }>;
}

/**
 * Three outcomes, kept apart on purpose.
 *
 * "missing" is a real 404 and should be one, so the address never gets
 * indexed. "unavailable" means the backend did not answer — rendering 404 for
 * that would tell search engines the whole dictionary had been deleted the
 * moment the API hiccupped, so the page is served and the client retries.
 */
type LoadResult =
  | { status: "ok"; term: TermDetail }
  | { status: "missing" }
  | { status: "unavailable" };

const loadTerm = async (word: string): Promise<LoadResult> => {
  const id = Number.parseInt(word, 10);
  if (Number.isNaN(id) || id <= 0) return { status: "missing" };

  try {
    return { status: "ok", term: await fetchTerm(id) };
  } catch (error) {
    if (isApiError(error) && error.kind === "notFound") {
      return { status: "missing" };
    }
    logger.error("SSR term fetch failed:", error);
    return { status: "unavailable" };
  }
};

/** Plain text for the <meta description>, cut at a word boundary. */
const summarize = (html: string, limit = 160): string => {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

export async function generateMetadata({
  params,
}: TermPageProps): Promise<Metadata> {
  const { word } = await params;
  const result = await loadTerm(word);

  if (result.status !== "ok") {
    return { title: "Termin topilmadi — Diplomatik izohli lugʻat" };
  }

  const description = summarize(result.term.definition ?? "");

  return {
    title: `${result.term.title} — Diplomatik izohli lugʻat`,
    description,
    openGraph: {
      title: result.term.title,
      description,
      type: "article",
    },
  };
}

export default async function TermPage({ params }: TermPageProps) {
  const { word } = await params;
  const result = await loadTerm(word);

  if (result.status === "missing") {
    notFound();
  }

  return (
    <TermClient
      termId={word}
      initialTerm={result.status === "ok" ? result.term : null}
    />
  );
}
