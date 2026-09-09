import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";
import { TermSummary } from "@/types";

/**
 * Fuzzy search configuration for dictionary terms
 * Uses Fuse.js for flexible, typo-tolerant search
 */
const fuseOptions: IFuseOptions<TermSummary> = {
  // Search across multiple fields
  keys: [
    {
      name: "title",
      weight: 0.7, // Title is most important
    },
    {
      name: "definition",
      weight: 0.2, // Definition is secondary
    },
    {
      name: "category",
      weight: 0.1, // Category is least important
    },
  ],
  // Threshold: 0.0 = perfect match, 1.0 = match anything
  // 0.3 allows for ~2-3 character typos in a typical term
  threshold: 0.3,
  // Distance: how far to search for a match
  distance: 100,
  // Minimum match character length
  minMatchCharLength: 2,
  // Include score and matches in results
  includeScore: true,
  includeMatches: true,
  // Use extended search for advanced queries
  useExtendedSearch: false,
  // Ignore location (search entire string)
  ignoreLocation: true,
};

/**
 * Create a fuzzy search instance for dictionary terms
 */
export const createFuzzySearch = (terms: TermSummary[]) => {
  return new Fuse(terms, fuseOptions);
};

/**
 * Perform fuzzy search on dictionary terms
 * Returns results sorted by relevance score
 */
export const fuzzySearchTerms = (
  terms: TermSummary[],
  query: string,
  limit: number = 100,
): TermSummary[] => {
  if (!query.trim()) {
    return terms;
  }

  const fuse = createFuzzySearch(terms);
  const results = fuse.search(query, { limit });

  // Extract items from Fuse results
  return results.map((result) => result.item);
};

/**
 * Get search suggestions (top 10 results)
 */
export const getSearchSuggestions = (
  terms: TermSummary[],
  query: string,
): TermSummary[] => {
  return fuzzySearchTerms(terms, query, 10);
};

/**
 * Highlight matching text in search results
 */
export const highlightMatches = (
  text: string,
  query: string,
): { text: string; isMatch: boolean }[] => {
  if (!query.trim()) {
    return [{ text, isMatch: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return [{ text, isMatch: false }];
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return [
    { text: before, isMatch: false },
    { text: match, isMatch: true },
    { text: after, isMatch: false },
  ].filter((part) => part.text.length > 0);
};
