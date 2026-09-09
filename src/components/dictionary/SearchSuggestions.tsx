import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TermSummary } from "@/types";
import { CircularProgress } from "@mui/material";
import { Clock, Search, X } from "lucide-react";
import {
  getRecentSearches,
  removeFromSearchHistory,
} from "@/lib/search/searchHistory";
import { highlightMatches } from "@/lib/search/fuzzySearch";

interface SearchSuggestionsProps {
  query: string;
  suggestions: TermSummary[];
  isLoading: boolean;
  onSelect: (term: TermSummary) => void;
  onSearchHistory: (query: string) => void;
  onClose: () => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  suggestions,
  isLoading,
  onSelect,
  onSearchHistory,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches when query is empty
  useEffect(() => {
    if (!query.trim()) {
      setRecentSearches(getRecentSearches(5));
    }
  }, [query]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions, query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const maxIndex = query.trim()
        ? suggestions.length - 1
        : recentSearches.length - 1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        if (query.trim()) {
          const selected = suggestions[selectedIndex];
          if (selected) onSelect(selected);
        } else {
          const selected = recentSearches[selectedIndex];
          if (selected) onSearchHistory(selected);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedIndex,
    suggestions,
    recentSearches,
    query,
    onSelect,
    onSearchHistory,
    onClose,
  ]);

  const handleRemoveHistory = (
    e: React.MouseEvent,
    searchQuery: string,
  ): void => {
    e.stopPropagation();
    removeFromSearchHistory(searchQuery);
    setRecentSearches((prev) => prev.filter((q) => q !== searchQuery));
  };

  // Show recent searches when no query
  if (!query.trim()) {
    if (recentSearches.length === 0) {
      return null;
    }

    return (
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Oxirgi qidiruvlar
          </p>
        </div>
        <ul className="py-1 max-h-60 overflow-y-auto">
          {recentSearches.map((search, index) => (
            <li
              key={search}
              className={`group hover:bg-blue-50 border-b border-gray-100 last:border-0 cursor-pointer ${
                selectedIndex === index ? "bg-blue-50" : ""
              }`}
              onClick={() => onSearchHistory(search)}
            >
              <div className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-3 flex-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{search}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveHistory(e, search)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                  aria-label="Remove from history"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="flex justify-center items-center p-6">
          <CircularProgress size={24} />
          <span className="ml-3 text-sm text-gray-500">Qidirilmoqda...</span>
        </div>
      </div>
    );
  }

  // Show suggestions
  if (suggestions.length === 0) {
    return (
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="px-4 py-6 text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            &quot;{query}&quot; bo&apos;yicha hech narsa topilmadi
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Boshqa so&apos;z bilan qidiring
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Natijalar ({suggestions.length})
        </p>
      </div>
      <ul className="py-1 max-h-80 overflow-y-auto">
        {suggestions.map((term, index) => {
          const titleParts = highlightMatches(term.title, query);

          return (
            <li
              key={term.id}
              className={`hover:bg-blue-50 border-b border-gray-100 last:border-0 ${
                selectedIndex === index ? "bg-blue-50" : ""
              }`}
            >
              <Link
                href={`/dictionary/${term.id}`}
                className="block px-4 py-3 cursor-pointer"
                onClick={() => onSelect(term)}
              >
                <div className="flex items-start gap-3">
                  <Search className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {titleParts.map((part, i) => (
                        <span
                          key={i}
                          className={
                            part.isMatch
                              ? "bg-yellow-200 font-semibold"
                              : undefined
                          }
                        >
                          {part.text}
                        </span>
                      ))}
                    </p>
                    {term.category && (
                      <p className="text-xs text-gray-500 mt-1">
                        {term.category}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">
            ↑
          </kbd>{" "}
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">
            ↓
          </kbd>{" "}
          navigatsiya •{" "}
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">
            Enter
          </kbd>{" "}
          tanlash •{" "}
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">
            Esc
          </kbd>{" "}
          yopish
        </p>
      </div>
    </div>
  );
};
