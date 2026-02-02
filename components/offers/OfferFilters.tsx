"use client";

import { useState, useCallback } from "react";
import { OfferFilters } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Search, Filter, X, ChevronDown } from "lucide-react";

interface OfferFiltersProps {
  filters: OfferFilters;
  onFiltersChange: (filters: OfferFilters) => void;
  categories: string[];
  stores?: string[];
}

const sortOptions = [
  { value: "popularity", label: "Popularity / Trending" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "discount_desc", label: "Discount: High to Low" },
  { value: "newest", label: "Newest First" },
];

export function OfferFilters({
  filters,
  onFiltersChange,
  categories,
  stores = [],
}: OfferFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Debounced search
  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      const timeout = setTimeout(() => {
        onFiltersChange({ ...filters, search: value, page: 1 });
      }, 300);
      return () => clearTimeout(timeout);
    },
    [filters, onFiltersChange]
  );

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === "All" ? undefined : category,
      page: 1,
    });
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    onFiltersChange({
      ...filters,
      [type === "min" ? "minPrice" : "maxPrice"]: numValue,
      page: 1,
    });
  };

  const handleSortChange = (sortBy: string) => {
    let newFilters: OfferFilters = { ...filters, sortBy: undefined, sortOrder: undefined, page: 1 };

    switch (sortBy) {
      case "price_asc":
        newFilters.sortBy = "discountedPrice";
        newFilters.sortOrder = "asc";
        break;
      case "price_desc":
        newFilters.sortBy = "discountedPrice";
        newFilters.sortOrder = "desc";
        break;
      case "discount_desc":
        newFilters.sortBy = "discountPercentage";
        newFilters.sortOrder = "desc";
        break;
      case "newest":
        newFilters.sortBy = "createdAt";
        newFilters.sortOrder = "desc";
        break;
      default:
        newFilters.sortBy = "popularity";
        break;
    }

    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({
      page: 1,
      limit: filters.limit,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.sortBy;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-orange-500" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>
        <button
          className="lg:hidden p-1 hover:bg-gray-100 rounded"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search offers..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="mb-4">
        <Select
          label="Sort By"
          options={[
            { value: "", label: "Default" },
            ...sortOptions.map((opt) => ({ value: opt.value, label: opt.label })),
          ]}
          value={
            filters.sortBy === "discountedPrice" && filters.sortOrder === "asc"
              ? "price_asc"
              : filters.sortBy === "discountedPrice" && filters.sortOrder === "desc"
              ? "price_desc"
              : filters.sortBy === "discountPercentage" && filters.sortOrder === "desc"
              ? "discount_desc"
              : filters.sortBy === "createdAt"
              ? "newest"
              : "popularity"
          }
          onChange={(e) => handleSortChange(e.target.value)}
        />
      </div>

      {/* Mobile: Categories Horizontal Scroll */}
      <div className="lg:hidden mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !filters.category
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleCategoryChange("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.category === cat
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Categories */}
      <div className="hidden lg:block mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !filters.category
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => handleCategoryChange("All")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.category === cat
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="text-sm"
          />
          <span className="text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {/* Stores Filter (if provided) */}
      {stores.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stores
          </label>
          <Select
            options={[
              { value: "", label: "All Stores" },
              ...stores.map((store) => ({ value: store, label: store })),
            ]}
            value={filters.store || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                store: e.target.value || undefined,
                page: 1,
              })
            }
          />
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={clearFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
