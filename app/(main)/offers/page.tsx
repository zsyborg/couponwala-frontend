"use client";

import { useState, useEffect, useCallback } from "react";
import { Offer, OfferFilters, Category } from "@/types";
import { offers, categories, cart } from "@/lib/api";
import { OfferGrid } from "@/components/offers/OfferGrid";
import { OfferFilters as OfferFiltersComponent } from "@/components/offers/OfferFilters";
import { useToast } from "@/components/ui/Toast";

const defaultFilters: OfferFilters = {
  page: 1,
  limit: 12,
};

export default function OffersPage() {
  const [offersList, setOffersList] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [filters, setFilters] = useState<OfferFilters>(defaultFilters);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const { addToast } = useToast();

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await categories.getAll();
      setCategoryList(response.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  // Fetch offers
  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await offers.getAll(filters);
      setOffersList(response.data || []);
      setPagination(
        response.meta || {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 1,
        }
      );
    } catch (error: any) {
      console.error("Failed to fetch offers:", error);
      addToast("error", error.message || "Failed to fetch offers");
    } finally {
      setIsLoading(false);
    }
  }, [filters, addToast]);

  // Load more offers
  const loadMoreOffers = useCallback(async () => {
    if (isLoadingMore || pagination.page >= pagination.totalPages) return;

    setIsLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      const response = await offers.getAll({ ...filters, page: nextPage });
      setOffersList((prev) => [...prev, ...(response.data || [])]);
      setPagination(
        response.meta || {
          total: 0,
          page: nextPage,
          limit: 12,
          totalPages: 1,
        }
      );
    } catch (error: any) {
      console.error("Failed to load more offers:", error);
      addToast("error", error.message || "Failed to load more offers");
    } finally {
      setIsLoadingMore(false);
    }
  }, [filters, pagination, isLoadingMore, addToast]);

  // Add to cart
  const handleAddToCart = useCallback(
    async (offer: Offer) => {
      try {
        await cart.add(offer.id);
        addToast("success", `${offer.serviceName} added to cart!`);
      } catch (error: any) {
        console.error("Failed to add to cart:", error);
        addToast("error", error.message || "Failed to add to cart");
      }
    },
    [addToast]
  );

  // Initial data fetch
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Get category names for filter
  const categoryNames = categoryList.map((cat) => cat.name);

  // Get unique stores from offers
  const stores = [...new Set(offersList.map((offer) => offer.store))];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Offers</h1>
          <p className="text-gray-600">
            Discover amazing deals and save on your favorite services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <OfferFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                categories={categoryNames.length > 0 ? categoryNames : ["Streaming", "Music", "Shopping", "Food", "Travel", "Gaming"]}
                stores={stores}
              />
            </div>
          </div>

          {/* Offer Grid */}
          <div className="lg:col-span-3">
            <OfferGrid
              offers={offersList}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasMore={pagination.page < pagination.totalPages}
              onLoadMore={loadMoreOffers}
              onAddToCart={handleAddToCart}
              searchQuery={filters.search || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
