import React, { useState, useEffect, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import { Button } from "@mui/material";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  trigger: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  liveSearch?: boolean; // optional prop to trigger on typing
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  trigger,
  placeholder = "Terminlarni qidirish...",
  className = "",
  disabled = false,
  liveSearch = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    onChange(val);
    if (liveSearch) {
      trigger(val.trim());
    }
  };

  const handleSubmit = () => {
    onChange(localValue.trim());
    if (localValue.trim()) {
      trigger(localValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      setFocused(false);
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setLocalValue("");
      onChange("");
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    trigger(""); // optional: also refresh terms when cleared
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Backdrop */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={focused}
        onClick={() => {
          setFocused(false);
          inputRef.current?.blur();
        }}
      />

      <div className={`relative flex items-center z-[1400] ${className}`}>
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
          onFocus={() => setFocused(true)}
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
    </>
  );
};
