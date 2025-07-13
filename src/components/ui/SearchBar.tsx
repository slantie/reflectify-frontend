/**
 * @file src/components/ui/SearchBar.tsx
 * @description Advanced search bar component with filters, suggestions, and keyboard navigation
 */

import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

// Search suggestion interface
export interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
  icon?: ReactNode;
  data?: any;
}

// Search filter interface
export interface SearchFilter {
  id: string;
  label: string;
  value: any;
  active: boolean;
}

// SearchBar props interface
export interface SearchBarProps {
  value?: string;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  filters?: SearchFilter[];
  showFilters?: boolean;
  showClearButton?: boolean;
  debounceMs?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  loading?: boolean;
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  onFilterChange?: (filters: SearchFilter[]) => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// SearchBar component
export const SearchBar: React.FC<SearchBarProps> = ({
  value = "",
  placeholder = "Search...",
  suggestions = [],
  filters = [],
  showFilters = false,
  showClearButton = true,
  debounceMs = 300,
  size = "md",
  className = "",
  inputClassName = "",
  disabled = false,
  loading = false,
  onSearch,
  onChange,
  onSuggestionSelect,
  onFilterChange,
  onClear,
  onFocus,
  onBlur,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [localFilters, setLocalFilters] = useState(filters);

  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const onSearchRef = useRef(onSearch);

  // Update ref when onSearch changes
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Size configurations
  const sizeConfig = {
    sm: {
      input: "h-8 text-sm",
      icon: "w-4 h-4",
      padding: "pl-8 pr-8",
    },
    md: {
      input: "h-10 text-sm",
      icon: "w-5 h-5",
      padding: "pl-10 pr-10",
    },
    lg: {
      input: "h-12 text-base",
      icon: "w-6 h-6",
      padding: "pl-12 pr-12",
    },
  };

  const config = sizeConfig[size];

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Update local filters when prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearchRef.current?.(inputValue);
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, debounceMs]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowFiltersPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input change
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);
      onChange?.(newValue);
      setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
      setFocusedIndex(-1);
    },
    [onChange, suggestions.length],
  );

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    onFocus?.();
    if (inputValue.length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [onFocus, inputValue.length, suggestions.length]);

  // Handle input blur
  const handleInputBlur = useCallback(() => {
    onBlur?.();
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, [onBlur]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      setInputValue(suggestion.text);
      setShowSuggestions(false);
      setFocusedIndex(-1);
      onSuggestionSelect?.(suggestion);
      onSearchRef.current?.(suggestion.text);
    },
    [onSuggestionSelect],
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!showSuggestions || suggestions.length === 0) {
        if (event.key === "Enter") {
          onSearchRef.current?.(inputValue);
        }
        return;
      }

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setFocusedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1,
          );
          break;
        case "Enter":
          event.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[focusedIndex]);
          } else {
            onSearchRef.current?.(inputValue);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setFocusedIndex(-1);
          break;
      }
    },
    [
      showSuggestions,
      suggestions,
      focusedIndex,
      inputValue,
      handleSuggestionClick,
    ],
  );

  // Handle clear
  const handleClear = useCallback(() => {
    setInputValue("");
    setShowSuggestions(false);
    setFocusedIndex(-1);
    onChange?.("");
    onClear?.();
    inputRef.current?.focus();
  }, [onChange, onClear]);

  // Handle filter toggle
  const handleFilterToggle = useCallback(
    (filterId: string) => {
      const updatedFilters = localFilters.map((filter) =>
        filter.id === filterId ? { ...filter, active: !filter.active } : filter,
      );
      setLocalFilters(updatedFilters);
      onFilterChange?.(updatedFilters);
    },
    [localFilters, onFilterChange],
  );

  // Group suggestions by category
  const groupedSuggestions = suggestions.reduce(
    (groups, suggestion) => {
      const category = suggestion.category || "General";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(suggestion);
      return groups;
    },
    {} as Record<string, SearchSuggestion[]>,
  );

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div
          className={`absolute inset-y-0 left-0 ${
            size === "sm" ? "pl-2" : size === "lg" ? "pl-4" : "pl-3"
          } flex items-center pointer-events-none`}
        >
          {loading ? (
            <div
              className={`animate-spin rounded-full border-2 border-current border-t-transparent ${config.icon}`}
            />
          ) : (
            <MagnifyingGlassIcon
              className={`${config.icon} text-light-muted-text dark:text-dark-muted-text`}
            />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full ${config.input} ${config.padding}
            bg-light-background dark:bg-dark-background
            text-light-text dark:text-dark-text
            border border-light-secondary dark:border-dark-secondary
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-primary-main
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            ${showClearButton && inputValue ? "pr-16" : ""}
            ${showFilters ? "pr-20" : ""}
            ${inputClassName}
          `}
        />

        {/* Clear Button */}
        {showClearButton && inputValue && (
          <button
            onClick={handleClear}
            className={`
              absolute inset-y-0 ${showFilters ? "right-10" : "right-2"} 
              ${size === "sm" ? "px-1" : "px-2"} 
              flex items-center
              text-light-muted-text dark:text-dark-muted-text
              hover:text-light-text dark:hover:text-dark-text
              transition-colors duration-200
            `}
            title="Clear search"
          >
            <XMarkIcon className={config.icon} />
          </button>
        )}

        {/* Filters Button */}
        {showFilters && (
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`
              absolute inset-y-0 right-2 ${size === "sm" ? "px-1" : "px-2"} 
              flex items-center
              text-light-muted-text dark:text-dark-muted-text
              hover:text-light-text dark:hover:text-dark-text
              transition-colors duration-200
              ${
                localFilters.some((f) => f.active)
                  ? "text-light-highlight dark:text-dark-highlight"
                  : ""
              }
            `}
            title="Toggle filters"
          >
            <AdjustmentsHorizontalIcon className={config.icon} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-light-background dark:bg-dark-background border border-light-secondary dark:border-dark-secondary rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {Object.entries(groupedSuggestions).map(
            ([category, categorySuggestions]) => (
              <div key={category}>
                {Object.keys(groupedSuggestions).length > 1 && (
                  <div className="px-3 py-2 text-xs font-medium text-light-muted-text dark:text-dark-muted-text bg-light-muted-background dark:bg-dark-muted-background">
                    {category}
                  </div>
                )}
                {categorySuggestions.map((suggestion) => {
                  const globalIndex = suggestions.indexOf(suggestion);
                  return (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`
                      w-full flex items-center gap-3 px-3 py-2 text-left text-sm
                      transition-colors duration-150
                      ${
                        globalIndex === focusedIndex
                          ? "bg-primary-lighter dark:bg-primary-darker text-primary-dark dark:text-primary-light"
                          : "text-light-text dark:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover"
                      }
                    `}
                    >
                      {suggestion.icon && (
                        <span className="w-4 h-4 flex-shrink-0">
                          {suggestion.icon}
                        </span>
                      )}
                      <span className="flex-1 truncate">{suggestion.text}</span>
                    </button>
                  );
                })}
              </div>
            ),
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFiltersPanel && showFilters && localFilters.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-light-background dark:bg-dark-background border border-light-secondary dark:border-dark-secondary rounded-lg shadow-lg p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-light-text dark:text-dark-text">
              Filters
            </h4>
            <div className="space-y-2">
              {localFilters.map((filter) => (
                <label
                  key={filter.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filter.active}
                    onChange={() => handleFilterToggle(filter.id)}
                    className="w-4 h-4 text-light-highlight dark:text-dark-highlight bg-light-background dark:bg-dark-background border border-light-secondary dark:border-dark-secondary rounded focus:ring-2 focus:ring-primary-main"
                  />
                  <span className="text-sm text-light-text dark:text-dark-text">
                    {filter.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
