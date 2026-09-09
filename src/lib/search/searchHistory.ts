/**
 * Search history management
 * Stores recent searches in localStorage for quick access
 */

const STORAGE_KEY = "dictionary_search_history";
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

/**
 * Get search history from localStorage
 */
export const getSearchHistory = (): SearchHistoryItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history: SearchHistoryItem[] = JSON.parse(stored);
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to load search history:", error);
    return [];
  }
};

/**
 * Add a search query to history
 */
export const addToSearchHistory = (query: string): void => {
  if (typeof window === "undefined") return;
  if (!query.trim()) return;

  try {
    const history = getSearchHistory();

    // Remove duplicate if exists
    const filtered = history.filter(
      (item) => item.query.toLowerCase() !== query.toLowerCase(),
    );

    // Add new item at the beginning
    const newHistory: SearchHistoryItem[] = [
      { query: query.trim(), timestamp: Date.now() },
      ...filtered,
    ].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Failed to save search history:", error);
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear search history:", error);
  }
};

/**
 * Remove a specific item from search history
 */
export const removeFromSearchHistory = (query: string): void => {
  if (typeof window === "undefined") return;

  try {
    const history = getSearchHistory();
    const filtered = history.filter(
      (item) => item.query.toLowerCase() !== query.toLowerCase(),
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to remove from search history:", error);
  }
};

/**
 * Get recent search queries (strings only)
 */
export const getRecentSearches = (limit: number = 5): string[] => {
  const history = getSearchHistory();
  return history.slice(0, limit).map((item) => item.query);
};
