import { useState, useEffect, useCallback } from "react";
import { TermSummary, DictionaryState } from "@/types";
import { logger, debounce } from "@/lib/utils";
import { fetchTerms, searchTerms } from "@/lib/termsApi";

interface UseDictionaryReturn extends DictionaryState {
  refreshData: (search?: string) => Promise<void>;
  setSearch: (search: string) => void;
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

  const loadData = useCallback(async (search: string = "") => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      logger.info("Loading dictionary data...");

      const termsData = await searchTerms(search);

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
    async (search: string = "") => {
      await loadData(search);
    },
    [loadData]
  );

  const debouncedRefresh = debounce(refreshData, 300);

  const setSearch = useCallback((search: string) => {
    setState((prev) => ({ ...prev, search }));
    debouncedRefresh(search);
  }, [debouncedRefresh]);

  const totalTerms = state.terms.length;

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    refreshData,
    setSearch,
    totalTerms,
  };
};