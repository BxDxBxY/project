"use client";
import React, { useState, useEffect, useCallback } from "react";
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

export const AsyncTermSelect: React.FC<AsyncTermSelectProps> = React.memo(
  ({ value, onChange, disabled }) => {
    const [options, setOptions] = useState<TermSummary[]>([]);
    const [selectedTerms, setSelectedTerms] = useState<TermSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [debouncedInput, setDebouncedInput] = useState("");

    // 🔹 Normalize incoming value to ids
    const valueIds = value.map((v) => (typeof v === "number" ? v : v.id));

    // 🔹 Load selected terms (from ids or objects)
    useEffect(() => {
      const loadSelectedTerms = async () => {
        const missingIds: number[] = [];
        const providedObjects: TermSummary[] = [];

        value.forEach((v) => {
          if (typeof v === "number") {
            if (
              !selectedTerms.some((t) => t.id === v) &&
              !options.some((t) => t.id === v)
            ) {
              missingIds.push(v);
            }
          } else {
            if (
              !selectedTerms.some((t) => t.id === v.id) &&
              !options.some((t) => t.id === v.id)
            ) {
              providedObjects.push(v);
            }
          }
        });

        if (providedObjects.length > 0) {
          setSelectedTerms((prev) => [...prev, ...providedObjects]);
        }

        if (missingIds.length > 0) {
          setLoading(true);
          try {
            const terms = await Promise.all(
              missingIds.map((id) => fetchTerm(id))
            );
            setSelectedTerms((prev) => [...prev, ...terms]);
          } catch (error) {
            console.error("Failed to load selected terms:", error);
          } finally {
            setLoading(false);
          }
        }
      };
      loadSelectedTerms();
    }, [value, options, selectedTerms]);

    // 🔹 Combine options + selected
    const allOptions = [...options, ...selectedTerms].reduce((unique, term) => {
      if (!unique.some((t) => t.id === term.id)) {
        unique.push(term);
      }
      return unique;
    }, [] as TermSummary[]);

    // 🔹 Debounce input
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedInput(inputValue);
      }, 600);
      return () => clearTimeout(handler);
    }, [inputValue]);

    // 🔹 Fetch terms from search
    const fetchTerms = useCallback(async () => {
      if (!debouncedInput.trim()) {
        setOptions([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const results = await searchTerms(debouncedInput);
        const validTerms = (
          Array.isArray(results) ? results : results || []
        ).filter(
          (term: any) =>
            term &&
            typeof term.id === "number" &&
            typeof term.title === "string"
        );
        setOptions(validTerms);
      } catch (error) {
        console.error("Failed to fetch terms:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, [debouncedInput]);

    useEffect(() => {
      fetchTerms();
    }, [fetchTerms]);

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
  }
);
