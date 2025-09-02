import { ApiError, Category, TermDetail, TermSummary } from "@/types";

// Error handling utilities
export class AppError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number = 500, details?: any) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status,
      details: error.details,
    };
  }

  if (error.response) {
    // Server responded with error status
    return {
      message:
        error.response.data?.message ||
        error.response.statusText ||
        "Server error",
      status: error.response.status,
      details: error.response.data,
    };
  }

  if (error.request) {
    // Network error
    return {
      message: "Network error - please check your connection",
      status: 0,
      details: error.request,
    };
  }

  // Other errors
  return {
    message: error.message || "An unexpected error occurred",
    status: 500,
    details: error,
  };
};

// Data validation utilities - Updated to match Swagger
export const validateTermsSummary = (term: any): term is TermSummary => {
  // console.log(term)
  return term && typeof term.id === "number" && typeof term.title === "string";
};
export const validateTerm = (term: any): term is TermDetail => {
  // console.log(term)
  return (
    term &&
    typeof term.id === "number" &&
    typeof term.title === "string" &&
    typeof term.definition === "string" &&
    Array.isArray(term.categories) &&
    // Array.isArray(term.photo_id) &&
    Array.isArray(term.related_terms) &&
    Array.isArray(term.related_countries) &&
    Array.isArray(term.sources) &&
    typeof term.created_at === "string" &&
    typeof term.updated_at === "string"
  );
};

export const validateCategory = (category: any): category is Category => {
  return (
    category &&
    typeof category.id === "number" &&
    typeof category.name === "string"
  );
};

export const validateTermsArray = (terms: any): terms is TermSummary[] => {
  return Array.isArray(terms) && terms.every(validateTermsSummary);
};

export const validateCategoriesArray = (
  categories: any,
): categories is Category[] => {
  return Array.isArray(categories) && categories.every(validateCategory);
};

// Search and filtering utilities - Updated to match Swagger
// export const filterTerms = (
//   terms: Term[],
//   search: string,
//   selectedCategory: string,
//   language: string = "en"
// ): Term[] => {
//   let filtered = [...terms];

//   // Filter by category
//   if (selectedCategory) {
//     filtered = filtered.filter((term) => {
//       const categoryId = term.categories;
//       return String(categoryId) === selectedCategory;
//     });
//   }

//   // Filter by search term
//   if (search.trim()) {
//     const searchLower = search.toLowerCase();
//     filtered = filtered.filter((term) => {
//       // Search in title
//       if (term.title.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       // Search in definition
//       if (term.definition.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       return false;
//     });
//   }

//   // Sort alphabetically
//   return filtered.sort((a, b) => a.title.localeCompare(b.title));
// };

// Language utilities - Updated to work with new structure
export const getTermTranslation = (
  term: TermSummary,
  // language: string,
): string => {
  // For now, return the title since translations are not in the Swagger
  // This can be extended when translation support is added
  return term.title;
};

export const getTermDescription = (
  term: TermDetail,
  // language: string,
): string => {
  // For now, return the definition since translations are not in the Swagger
  // This can be extended when translation support is added
  return term.definition;
};

// Date formatting utilities
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};

// Local storage utilities with error handling
export const safeLocalStorage = {
  get: (key: string): string | null => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem(key);
      }
      return null;
    } catch {
      return null;
    }
  },

  set: (key: string, value: string): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  clear: (): boolean => {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};

// Debounce utility for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Retry utility for API calls
export const retry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, delay * Math.pow(2, i)),
        );
      }
    }
  }

  throw lastError!;
};

// Constants
// export const SUPPORTED_LANGUAGES: Language[] = [
//   { code: "en", label: "English" },
//   { code: "uz", label: "Uzbek" },
//   { code: "ru", label: "Русский" },
// ];

export const DEFAULT_LANGUAGE = "en";

// Environment utilities
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";

// Logging utilities
export const logger = {
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data || "");
    }
  },

  error: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error || "");
    }
  },

  warn: (message: string, data?: any) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data || "");
    }
  },
};
