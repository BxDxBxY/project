"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Checkbox,
  Chip,
  Tooltip,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { TermSummary } from "@/types";
import { searchTerms, fetchTerm } from "@/lib/termsApi";

interface AsyncTermSelectProps {
  value: (number | TermSummary)[];
  disabled: boolean;
  onChange: (ids: number[]) => void;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/**
 * Small custom debounce hook
 */
function useDebounce<T>(value: T, delay = 600): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const AsyncTermSelect: React.FC<AsyncTermSelectProps> = React.memo(
  ({ value, onChange, disabled }) => {
    const [options, setOptions] = useState<TermSummary[]>([]);
    const [selectedTerms, setSelectedTerms] = useState<TermSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const debouncedInput = useDebounce(inputValue);

    // Normalize incoming value to ids
    const valueIds = useMemo(
      () => value.map((v) => (typeof v === "number" ? v : v.id)),
      [value],
    );

    /**
     * Keep selected terms in sync with incoming `value`
     */
    useEffect(() => {
      const syncSelected = async () => {
        const known = [...options, ...selectedTerms];
        const provided = value.filter(
          (v): v is TermSummary => typeof v !== "number",
        );

        // Add provided objects
        if (provided.length > 0) {
          setSelectedTerms((prev) => {
            const updated = [...prev];
            provided.forEach((term) => {
              if (!updated.some((t) => t.id === term.id)) {
                updated.push(term);
              }
            });
            return updated;
          });
        }

        // Find missing IDs not already known
        const missing = valueIds.filter(
          (id) => !known.some((t) => t.id === id),
        );

        if (missing.length > 0) {
          setLoading(true);
          try {
            // TODO: replace with batch API if available
            const terms = await Promise.all(missing.map(fetchTerm));
            setSelectedTerms((prev) => {
              const updated = [...prev];
              terms.forEach((term) => {
                if (!updated.some((t) => t.id === term.id)) {
                  updated.push(term);
                }
              });
              return updated;
            });
          } catch (error) {
            console.error("Failed to load selected terms:", error);
          } finally {
            setLoading(false);
          }
        }
      };

      syncSelected();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]); // ✅ only depend on value

    /**
     * Combine options + selectedTerms into one unique array
     */
    const allOptions = useMemo(() => {
      return [...options, ...selectedTerms].filter(
        (term, idx, arr) => arr.findIndex((t) => t.id === term.id) === idx,
      );
    }, [options, selectedTerms]);

    /**
     * Fetch terms from API when user types
     */
    useEffect(() => {
      const fetchTerms = async () => {
        if (!debouncedInput.trim()) {
          setOptions([]);
          return;
        }
        setLoading(true);
        try {
          const results = await searchTerms(debouncedInput);
          const validTerms = (Array.isArray(results) ? results : []).filter(
            (t) => t && typeof t.id === "number" && typeof t.title === "string",
          );
          setOptions(validTerms);
        } catch (error) {
          console.error("Failed to fetch terms:", error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      };
      fetchTerms();
    }, [debouncedInput]);

    return (
      <Autocomplete
        multiple
        disabled={disabled}
        id="related-terms-select"
        options={allOptions}
        value={allOptions.filter((t) => valueIds.includes(t.id))}
        disableCloseOnSelect
        getOptionLabel={(option) => option.title || ""}
        isOptionEqualToValue={(option, selected) => option.id === selected.id}
        onChange={(_, newValue) => {
          const newIds = newValue.map((v) => v.id);
          onChange(newIds);

          // Cache any new terms locally
          setSelectedTerms((prev) => {
            const updated = [...prev];
            newValue.forEach((term) => {
              if (!updated.some((t) => t.id === term.id)) {
                updated.push(term);
              }
            });
            return updated;
          });
        }}
        onInputChange={(_, newInputValue, reason) => {
          if (reason === "input") {
            setInputValue(newInputValue);
          }
        }}
        inputValue={inputValue}
        filterOptions={(x) => x} // disable client filtering
        filterSelectedOptions
        loading={loading}
        openOnFocus
        noOptionsText={
          inputValue.trim() ? "No terms found" : "Type to search terms"
        }
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={option.id} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.title}
            </li>
          );
        }}
        renderValue={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Tooltip title={option.title} key={option.id}>
                <Chip
                  {...tagProps}
                  label={option.title}
                  size="small"
                  style={{
                    maxWidth: "300px",
                    width: "150px",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                />
              </Tooltip>
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Related Terms"
            placeholder="Search terms..."
            className="w-full !rounded-md !border-gray-300"
            slotProps={{
              input: {
                ...params.InputProps,
                className: "text-gray-800 !rounded-md",
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress size={18} className="!text-gray-500" />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
              inputLabel: {
                className: "text-gray-700",
              },
            }}
          />
        )}
        className="w-full !bg-white !shadow-sm !rounded-md flex-wrap"
        sx={{
          "& .MuiAutocomplete-inputRoot": {
            padding: "0.5rem",
            flexWrap: "wrap", // wrap chips
            alignItems: "flex-start",
            maxHeight: "120px", // limit height
            overflowY: "auto", // scroll if too many
          },
          "& .MuiInputLabel-root": {
            transform: "translate(14px, 12px) scale(1)",
            "&.MuiInputLabel-shrink": {
              transform: "translate(14px, -6px) scale(0.75)",
            },
          },
          "& .MuiAutocomplete-popper": {
            zIndex: 1300,
          },
        }}
      />
    );
  },
);

AsyncTermSelect.displayName = "AsyncTermSelect";
export default AsyncTermSelect;
