"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { OfferFilters as OfferFiltersType } from "@/types";

interface OfferFiltersProps {
  filters: OfferFiltersType;
  onFiltersChange: (filters: OfferFiltersType) => void;
  categories: string[];
  stores: string[];
}

export function OfferFilters({
  filters,
  onFiltersChange,
  categories,
  stores,
}: OfferFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchValue });
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = filters.category === category ? undefined : category;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const handleStoreChange = (store: string) => {
    const newStore = filters.store === store ? undefined : store;
    onFiltersChange({ ...filters, store: newStore });
  };

  const handlePriceChange = (
    type: "minPrice" | "maxPrice",
    value: string
  ) => {
    const numValue = value ? parseFloat(value) : undefined;
    onFiltersChange({ ...filters, [type]: numValue });
  };

  const clearFilters = () => {
    setSearchValue("");
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.category ||
    filters.store ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.search;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search offers..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          Search
        </Button>
      </form>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters {hasActiveFilters && "(Active)"}
        </Button>
      </div>

      {/* Filters Section */}
      <div className={`${isOpen ? "block" : "hidden md:block"}`}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filters</CardTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium mb-2">Categories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.category === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Stores */}
            <div>
              <h4 className="text-sm font-medium mb-2">Stores</h4>
              <div className="flex flex-wrap gap-2">
                {stores.map((store) => (
                  <button
                    key={store}
                    onClick={() => handleStoreChange(store)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filters.store === store
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {store}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium mb-2">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
