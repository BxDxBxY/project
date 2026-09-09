/**
 * Google Analytics 4 Integration
 * Tracks page views, events, and user interactions
 */

// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-ZQM6WJ69BC";

// Check if GA is available
export const isGAEnabled = (): boolean => {
  return typeof window !== "undefined" && typeof window.gtag !== "undefined";
};

// Page view tracking
export const pageview = (url: string): void => {
  if (!isGAEnabled()) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Event tracking
export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: GAEvent): void => {
  if (!isGAEnabled()) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Predefined event types for type safety
export const trackEvent = {
  // Search events
  search: (query: string, resultsCount: number) => {
    event({
      action: "search",
      category: "Search",
      label: query,
      value: resultsCount,
    });
  },

  // Term view events
  viewTerm: (termId: number, termTitle: string) => {
    event({
      action: "view_term",
      category: "Dictionary",
      label: termTitle,
      value: termId,
    });
  },

  // Navigation events
  clickRelatedTerm: (fromTermId: number, toTermId: number) => {
    event({
      action: "click_related_term",
      category: "Navigation",
      label: `${fromTermId} -> ${toTermId}`,
    });
  },

  // Filter events
  applyFilter: (filterType: string, filterValue: string) => {
    event({
      action: "apply_filter",
      category: "Filters",
      label: `${filterType}: ${filterValue}`,
    });
  },

  // Sort events
  changeSort: (sortOption: string) => {
    event({
      action: "change_sort",
      category: "Filters",
      label: sortOption,
    });
  },

  // Search history events
  useSearchHistory: (query: string) => {
    event({
      action: "use_search_history",
      category: "Search",
      label: query,
    });
  },

  // Design mode events
  changeDesignMode: (mode: number) => {
    event({
      action: "change_design_mode",
      category: "UI",
      label: `Mode ${mode}`,
      value: mode,
    });
  },

  // Layout mode events
  changeLayoutMode: (mode: number) => {
    event({
      action: "change_layout_mode",
      category: "UI",
      label: `Layout ${mode}`,
      value: mode,
    });
  },

  // Error events
  error: (errorMessage: string, errorLocation: string) => {
    event({
      action: "error",
      category: "Errors",
      label: `${errorLocation}: ${errorMessage}`,
    });
  },

  // Contact form events
  submitContactForm: (success: boolean) => {
    event({
      action: "submit_contact_form",
      category: "Contact",
      label: success ? "Success" : "Failed",
      value: success ? 1 : 0,
    });
  },

  // Cookie consent events
  acceptCookies: () => {
    event({
      action: "accept_cookies",
      category: "Privacy",
      label: "Accepted",
    });
  },

  declineCookies: () => {
    event({
      action: "decline_cookies",
      category: "Privacy",
      label: "Declined",
    });
  },
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>,
    ) => void;
  }
}
