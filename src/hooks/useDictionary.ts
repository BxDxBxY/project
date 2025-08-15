import { useState, useEffect, useCallback, useMemo } from 'react';
import { Term, Category, DictionaryState } from '@/types';
// import { fetchTerms, fetchCategories } from '@/lib/api';
import { filterTerms, validateTermsArray, validateCategoriesArray, logger } from '@/lib/utils';
import { fetchTerms } from '@/lib/termsApi';
import { fetchCategories } from '@/lib/categoriesApi';

interface UseDictionaryReturn extends DictionaryState {
  refreshData: () => Promise<void>;
  setSearch: (search: string) => void;
  setSelectedCategory: (categoryId: string) => void;
  setLanguage: (language: string) => void;
  filteredTerms: Term[];
  totalTerms: number;
  totalCategories: number;
}

export const useDictionary = (): UseDictionaryReturn => {
  const [state, setState] = useState<DictionaryState>({
    terms: [],
    categories: [],
    loading: true,
    error: null,
    search: '',
    selectedCategory: '',
    language: 'en',
  });

  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      logger.info('Loading dictionary data...');
      
      const [termsData, categoriesData] = await Promise.all([
        fetchTerms(),
        fetchCategories(),
      ]);
      
      // Validate data
      if (!validateTermsArray(termsData)) {
        throw new Error('Invalid terms data received from server');
      }

      if (!validateCategoriesArray(categoriesData)) {
        throw new Error('Invalid categories data received from server');
      }

      setState(prev => ({
        ...prev,
        terms: termsData,
        categories: categoriesData,
        loading: false,
        error: null,
      }));

      logger.info(`Loaded ${termsData.length} terms and ${categoriesData.length} categories`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dictionary data';
      logger.error('Error loading dictionary data:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        terms: [],
        categories: [],
      }));
    }
  }, []);

  const refreshData = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const setSearch = useCallback((search: string) => {
    setState(prev => ({ ...prev, search }));
  }, []);

  const setSelectedCategory = useCallback((categoryId: string) => {
    setState(prev => ({ ...prev, selectedCategory: categoryId }));
  }, []);

  const setLanguage = useCallback((language: string) => {
    setState(prev => ({ ...prev, language }));
  }, []);

  // Memoized filtered terms
  const filteredTerms = useMemo(() => {
    return filterTerms(
      state.terms,
      state.search,
      state.selectedCategory,
      state.language
    );
  }, [state.terms, state.search, state.selectedCategory, state.language]);

  // Computed values
  const totalTerms = state.terms.length;
  const totalCategories = state.categories.length;

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    refreshData,
    setSearch,
    setSelectedCategory,
    setLanguage,
    filteredTerms,
    totalTerms,
    totalCategories,
  };
}; 