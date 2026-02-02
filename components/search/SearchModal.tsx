"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { Offer } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Demo offers for search results
const demoOffers: Offer[] = [
  {
    id: "1",
    serviceName: "Netflix 1 Month Premium",
    description: "Get 1 month of Netflix premium subscription",
    originalPrice: 799,
    discountedPrice: 399,
    discountPercentage: 50,
    category: "Streaming",
    store: "Netflix",
    couponCode: "NETFLIX50",
    imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=300&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    serviceName: "Amazon Prime 3 Months",
    description: "Get 3 months of Amazon Prime",
    originalPrice: 599,
    discountedPrice: 399,
    discountPercentage: 33,
    category: "Streaming",
    store: "Amazon",
    couponCode: "PRIME33",
    imageUrl: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=300&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    serviceName: "Spotify Premium 6 Months",
    description: "6 months of ad-free music streaming",
    originalPrice: 719,
    discountedPrice: 479,
    discountPercentage: 33,
    category: "Music",
    store: "Spotify",
    couponCode: "SPOTIFY6",
    imageUrl: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=300&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    serviceName: "Disney+ Hotstar 1 Year",
    description: "Annual subscription with premium content",
    originalPrice: 1499,
    discountedPrice: 999,
    discountPercentage: 33,
    category: "Streaming",
    store: "Disney+",
    couponCode: "DISNEY33",
    imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=300&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    serviceName: "YouTube Premium 6 Months",
    description: "Ad-free videos and YouTube Music",
    originalPrice: 780,
    discountedPrice: 520,
    discountPercentage: 33,
    category: "Streaming",
    store: "YouTube",
    couponCode: "YOUTUBE6",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const popularSearches = [
  "Netflix",
  "Amazon Prime",
  "Spotify",
  "Disney+",
  "YouTube Premium",
];

const recentSearchesKey = "couponwala_recent_searches";
const MAX_RECENT_SEARCHES = 5;

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Offer[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useOnClickOutside(modalRef as unknown as React.RefObject<HTMLElement>, onClose);

  // Load recent searches on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(recentSearchesKey);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setIsSearched(false);
    }
  }, [isOpen]);

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const filtered = demoOffers.filter(
        (offer) =>
          offer.serviceName.toLowerCase().includes(query.toLowerCase()) ||
          offer.store.toLowerCase().includes(query.toLowerCase()) ||
          offer.category.toLowerCase().includes(query.toLowerCase())
      );
      
      setResults(filtered);
      setIsLoading(false);
      setIsSearched(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) return;

      // Save to recent searches
      const newRecent = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(
        0,
        MAX_RECENT_SEARCHES
      );
      setRecentSearches(newRecent);
      if (typeof window !== "undefined") {
        localStorage.setItem(recentSearchesKey, JSON.stringify(newRecent));
      }

      // Navigate to offers page with search query
      router.push(`/offers?search=${encodeURIComponent(searchQuery)}`);
      onClose();
    },
    [recentSearches, router, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(recentSearchesKey);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for offers, stores, categories..."
            className="flex-1 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            </div>
          ) : isSearched ? (
            // Search Results
            <div className="py-2">
              {results.length > 0 ? (
                <>
                  {results.map((offer) => (
                    <Link
                      key={offer.id}
                      href={`/offers/${offer.id}`}
                      onClick={onClose}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={offer.imageUrl || "/placeholder-offer.jpg"}
                        alt={offer.serviceName}
                        className="w-16 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {offer.serviceName}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {offer.store} • {offer.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-orange-600 font-semibold">
                          ₹{offer.discountedPrice}
                        </span>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          ₹{offer.originalPrice}
                        </span>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/offers?search=${encodeURIComponent(query)}`}
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-orange-600 hover:bg-gray-50 transition-colors border-t"
                  >
                    View all results
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try different keywords or browse our categories
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Initial State - Popular & Recent Searches
            <div className="py-2">
              {/* Popular Searches */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <TrendingUp className="w-4 h-4" />
                    Popular Searches
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularClick(term)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 rounded-full text-sm transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="px-4 py-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="flex items-center gap-2 w-full px-2 py-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
