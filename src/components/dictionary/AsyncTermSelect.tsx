import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { TermSummary } from "@/types";
import { searchTerms } from "@/lib/termsApi";

interface AsyncTermSelectProps {
  value: number[];
  onChange: (ids: number[]) => void;
}

export const AsyncTermSelect: React.FC<AsyncTermSelectProps> = ({ value, onChange }) => {
  const [options, setOptions] = useState<TermSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");

  // debounce typing
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(inputValue), 400);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // search API
  useEffect(() => {
    if (!debouncedInput) {
      setOptions([]);
      return;
    }
    setLoading(true);
    searchTerms(debouncedInput)
      .then((res) => setOptions(res))
      .finally(() => setLoading(false));
  }, [debouncedInput]);

  return (
    <Autocomplete
      multiple
      options={options}
      value={options.filter((t) => value.includes(t.id))}
      getOptionLabel={(option) => option.title}
      onChange={(_, newValue) => onChange(newValue.map((v) => v.id))}
      inputValue={inputValue}                      // ✅ controlled input
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)} // ✅ typing works
      filterSelectedOptions
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Related Terms"
          placeholder="Search terms..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
