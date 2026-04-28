import { useState, useEffect, useCallback } from "react";
import { DictionaryState, TermSummary } from "@/types";
import { logger } from "@/lib/utils";
import { searchTerms } from "@/lib/termsApi";

let globalState: DictionaryState = {
  terms: [],
  categories: [],
  loading: true,
  error: null,
  search: "",
  selectedCategory: "",
  language: "uz",
};

// Cached raw DB dump (fetched once, filtered client side forever)
let fullTermsCache: TermSummary[] | null = null;

let hasInitialized = false;
const listeners = new Set<
  React.Dispatch<React.SetStateAction<DictionaryState>>
>();

const setGlobalState = (
  updater: (prev: DictionaryState) => DictionaryState,
) => {
  globalState = updater(globalState);
  listeners.forEach((listener) => listener(globalState));
};

interface UseDictionaryReturn extends DictionaryState {
  setSearch: (v: string) => void;
  triggerSearch: (q?: string) => Promise<void>;
  refreshData: (q?: string) => Promise<void>;
  totalTerms: number;
}

export const useDictionary = (
  initialTerms?: TermSummary[],
): UseDictionaryReturn => {
  const [state, setState] = useState<DictionaryState>(globalState);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  const loadData = useCallback(async () => {
    if (fullTermsCache !== null) {
      // Already cached!
      return;
    }

    if (initialTerms && initialTerms.length > 0) {
      logger.info("Hydrating dictionary cache from SSR initialTerms...");
      fullTermsCache = initialTerms;
      setGlobalState((prev) => ({
        ...prev,
        terms: initialTerms,
        loading: false,
        error: null,
      }));
      return;
    }

    setGlobalState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      logger.info("Loading FULL dictionary data on first mount...");
      // Unpaginated dump
      const termsData = await searchTerms("");
      fullTermsCache = termsData;
      setGlobalState((prev) => ({
        ...prev,
        terms: termsData, // Initially show all
        loading: false,
        error: null,
      }));
      logger.info(`Loaded ${termsData.length} terms into memory cache!`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load dictionary data";
      logger.error("Error loading dictionary data:", error);
      setGlobalState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        terms: [],
      }));
    }
  }, [initialTerms]);

  const triggerSearch = useCallback(
    async (q?: string) => {
      const query = (q ?? globalState.search).trim();
      setGlobalState((prev) => ({ ...prev, search: query }));

      if (!fullTermsCache) await loadData();

      if (fullTermsCache) {
        if (!query) {
          setGlobalState((prev) => ({ ...prev, terms: fullTermsCache! }));
        } else {
          const lowerQ = query.toLowerCase();
          const filtered = fullTermsCache.filter((t) =>
            t.title.toLowerCase().includes(lowerQ),
          );
          setGlobalState((prev) => ({ ...prev, terms: filtered }));
        }
      }
    },
    [loadData],
  );

  const refreshData = useCallback(async () => {
    // Hard refresh bypassing cache
    fullTermsCache = null;
    await loadData();
    triggerSearch(globalState.search);
  }, [loadData, triggerSearch]);

  const setSearch = useCallback((v: string) => {
    setGlobalState((prev) => ({ ...prev, search: v }));
  }, []);

  const totalTerms = state.terms.length;

  useEffect(() => {
    if (!hasInitialized) {
      hasInitialized = true;
      loadData();
    }
  }, [loadData]);

  return { ...state, setSearch, triggerSearch, refreshData, totalTerms };
};
