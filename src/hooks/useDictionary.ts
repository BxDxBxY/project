// useDictionary.ts
import { useState, useEffect, useCallback } from "react";
import { DictionaryState } from "@/types";
import { logger } from "@/lib/utils";
import { searchTerms } from "@/lib/termsApi";

interface UseDictionaryReturn extends DictionaryState {
  setSearch: (v: string) => void; // just updates state
  triggerSearch: (q?: string) => Promise<void>; // runs API with provided or current query
  refreshData: (q?: string) => Promise<void>;
  totalTerms: number;
}

export const useDictionary = (): UseDictionaryReturn => {
  const [state, setState] = useState<DictionaryState>({
    terms: [],
    categories: [],
    loading: true,
    error: null,
    search: "",
    selectedCategory: "",
    language: "en",
  });

  const loadData = useCallback(async (q: string = "") => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      logger.info("Loading dictionary data...", { q });
      const termsData = await searchTerms(q);
      setState((prev) => ({
        ...prev,
        terms: termsData,
        loading: false,
        error: null,
      }));
      logger.info(`Loaded ${termsData.length} terms`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load dictionary data";
      logger.error("Error loading dictionary data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        terms: [],
      }));
    }
  }, []);

  const refreshData = useCallback(
    (q?: string) => loadData(q && state.search),
    [loadData, state.search]
  );

  const setSearch = useCallback((v: string) => {
    setState((prev) => ({ ...prev, search: v }));
  }, []);

  // IMPORTANT: accept query directly so we don't read stale state
  const triggerSearch = useCallback(
    async (q?: string) => {
      const query = (q ?? state.search).trim();
      // also keep state.search in sync with what we actually search for
      setState((prev) => ({ ...prev, search: query }));
      await loadData(query);
    },
    [loadData, state.search]
  );

  const totalTerms = state.terms.length;

  // Initial load (empty query or whatever you want)
  useEffect(() => {
    loadData("");
  }, [loadData]);

  return { ...state, setSearch, triggerSearch, refreshData, totalTerms };
};
