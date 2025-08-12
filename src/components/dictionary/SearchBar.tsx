import React, { useState, useEffect, useRef } from "react";
import { debounce } from "@/lib/utils"; // debounce function as you provided

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search terms...",
  className = "",
  debounceMs = 300,
  disabled = false,
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Create a stable ref to store the debounced function
  const debouncedOnChangeRef = useRef(
    debounce((searchValue: string) => {
      onChange(searchValue);
    }, debounceMs)
  );

  // Update ref when debounceMs changes
  useEffect(() => {
    debouncedOnChangeRef.current = debounce((searchValue: string) => {
      onChange(searchValue);
    }, debounceMs);
  }, [debounceMs, onChange]);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChangeRef.current(newValue);
  };

  // Handle clear button
  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
    </div>
  );
};
