import { Filter } from "lucide-react";

export type SortOption = "alphabetical" | "newest" | "relevance";

interface SearchFiltersProps {
  selectedCategory: string;
  categories: string[];
  sortBy: SortOption;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: SortOption) => void;
  onClear: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedCategory,
  categories,
  sortBy,
  onCategoryChange,
  onSortChange,
  onClear,
  isOpen,
  onToggle,
}) => {
  const hasActiveFilters = selectedCategory || sortBy !== "relevance";

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          hasActiveFilters
            ? "bg-blue-50 border-blue-300 text-blue-700"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
        aria-label="Toggle filters"
      >
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filtrlar</span>
        {hasActiveFilters && (
          <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
            •
          </span>
        )}
      </button>

      {/* Filters Dropdown */}
      {isOpen && (
        <div className="absolute z-40 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700">
              Qidiruv filtrlari
            </h3>
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Tozalash
              </button>
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Kategoriya
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Barcha kategoriyalar</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Saralash
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="relevance"
                    checked={sortBy === "relevance"}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Mos kelish bo&apos;yicha
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="alphabetical"
                    checked={sortBy === "alphabetical"}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Alifbo bo&apos;yicha
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="newest"
                    checked={sortBy === "newest"}
                    onChange={(e) => onSortChange(e.target.value as SortOption)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Eng yangilari</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button
              onClick={onToggle}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Qo&apos;llash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
