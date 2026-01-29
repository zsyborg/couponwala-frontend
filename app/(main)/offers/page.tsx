"use client";

import { useState, useEffect, useCallback } from "react";
import { Offer, OfferFilters, PaginatedResponse } from "@/types";
import { offersApi } from "@/lib/api";
import { OfferGrid } from "@/components/offers/OfferGrid";
import { OfferFilters as OfferFiltersComponent } from "@/components/offers/OfferFilters";

const defaultFilters: OfferFilters = {
  page: 1,
  limit: 12,
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<OfferFilters>(defaultFilters);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  // Demo data for development
  const demoOffers: Offer[] = [
    {
      id: "1",
      serviceName: "Netflix 1 Month Subscription",
      description: "Get 1 month of Netflix premium subscription at 50% off. Valid for new users only.",
      originalPrice: 799,
      discountedPrice: 399,
      discountPercentage: 50,
      category: "Streaming",
      store: "Netflix",
      couponCode: "NETFLIX50",
      imageUrl: "https://via.placeholder.com/400x300",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      serviceName: "Spotify Premium 3 Months",
      description: "Enjoy 3 months of ad-free music with Spotify Premium. Cancel anytime.",
      originalPrice: 1197,
      discountedPrice: 599,
      discountPercentage: 50,
      category: "Music",
      store: "Spotify",
      couponCode: "SPOTIFY50",
      imageUrl: "https://via.placeholder.com/400x300",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      serviceName: "Amazon Prime Yearly",
      description: "Full year Amazon Prime membership with free delivery, Prime Video, and more.",
      originalPrice: 1499,
      discountedPrice: 999,
      discountPercentage: 33,
      category: "Shopping",
      store: "Amazon",
      couponCode: "PRIME33",
      imageUrl: "https://via.placeholder.com/400x300",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      serviceName: "Disney+ Hotstar VIP",
      description: "Access to exclusive Disney+ and Hotstar content for 1 year.",
      originalPrice: 1499,
      discountedPrice: 699,
      discountPercentage: 53,
      category: "Streaming",
      store: "Disney+",
      couponCode: "DISNEY50",
      imageUrl: "https://via.placeholder.com/400x300",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ];

  const categories = ["Streaming", "Music", "Shopping", "Food", "Travel", "Gaming"];
  const stores = ["Netflix", "Spotify", "Amazon", "Disney+", "Zomato", "Swiggy"];

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    try {
      // For demo, use mock data
      // In production, uncomment the API call below
      // const response = await offersApi.getAll(filters);
      // setOffers(response.data.data);
      // setPagination(response.data.meta);

      // Using demo data
      setOffers(demoOffers);
      setPagination({
        total: demoOffers.length,
        page: 1,
        limit: 12,
        totalPages: 1,
      });
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Offers</h1>
        <p className="text-muted-foreground">
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
              categories={categories}
              stores={stores}
            />
          </div>
        </div>

        {/* Offer Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {offers.length} offers
            </p>
          </div>
          <OfferGrid offers={offers} isLoading={isLoading} />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50"
                disabled={pagination.page === 1}
                onClick={() =>
                  setFilters({ ...filters, page: pagination.page - 1 })
                }
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setFilters({ ...filters, page: pagination.page + 1 })
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
