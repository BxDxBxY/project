import React, { useState, useEffect, useRef } from "react";
import { Button, CircularProgress } from "@mui/material";
import { searchTerms } from "@/lib/termsApi";
import { TermSummary } from "@/types";
import Link from "next/link";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  trigger: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  liveSearch?: boolean; // optional prop to trigger on typing
  enableAutocomplete?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  trigger,
  placeholder = "Terminlarni qidirish...",
  className = "",
  disabled = false,
  liveSearch = false,
  enableAutocomplete = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [suggestions, setSuggestions] = useState<TermSummary[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    onChange(val);

    if (liveSearch) {
      trigger(val.trim());
    }

    if (enableAutocomplete) {
      if (val.trim().length >= 2) {
        setIsTyping(true);
        setShowSuggestions(true);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
          try {
            const results = await searchTerms(val.trim());
            setSuggestions(results.slice(0, 8)); // Show up to 8 matching terms
          } catch (error) {
            console.error("Autocomplete fetch error:", error);
          } finally {
            setIsTyping(false);
          }
        }, 300);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
      }
    }
  };

  const handleSubmit = () => {
    onChange(localValue.trim());
    setShowSuggestions(false);
    if (localValue.trim()) {
      trigger(localValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setLocalValue("");
      onChange("");
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    trigger(""); // optional: also refresh terms when cleared
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={focused}
        onClick={() => {
          setFocused(false);
          inputRef.current?.blur();
        }}
      /> */}

      <div className={`relative flex items-center  ${className}`}>
        {/* search icon */}
        <div className="absolute left-0 pl-3 z-10 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* input */}
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="block w-full pl-10 pr-20 py-2 border-b-2 border-transparent  
                     rounded-t-md leading-5 bg-white shadow duration-300 transition-all 
                     focus:drop-shadow-2xl placeholder-gray-500 focus:outline-none  
                     focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        />

        {/* clear button */}
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-14 inset-y-0 pr-5 flex items-center cursor-pointer"
            type="button"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* submit button */}
        <Button
          onClick={handleSubmit}
          className="!absolute !capitalize !tracking-wide !cursor-pointer !right-0 !inset-y-0 !pr-3 !flex !items-center !text-blue-500 !hover:text-blue-700"
          type="button"
        >
          Qidirish
        </Button>
      </div>

      {/* Autocomplete Dropdown */}
      {enableAutocomplete &&
        showSuggestions &&
        localValue.trim().length >= 2 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {isTyping ? (
              <div className="flex justify-center p-4">
                <CircularProgress size={24} />
              </div>
            ) : suggestions.length > 0 ? (
              <ul className="py-1">
                {suggestions.map((term) => (
                  <li
                    key={term.id}
                    className="hover:bg-blue-50 border-b border-gray-100 last:border-0"
                  >
                    <Link
                      href={`/dictionary/${term.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 cursor-pointer w-full text-left"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <span className="font-medium">{term.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                Hech narsa topilmadi
              </div>
            )}
          </div>
        )}
    </div>
  );
};
