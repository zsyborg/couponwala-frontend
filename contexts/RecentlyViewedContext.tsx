"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Offer } from "@/types";

const RECENTLY_VIEWED_KEY = "couponwala_recently_viewed";
const MAX_RECENTLY_VIEWED = 10;

interface RecentlyViewedContextType {
  recentlyViewed: Offer[];
  addToRecentlyViewed: (offer: Offer) => void;
  removeFromRecentlyViewed: (offerId: string) => void;
  clearRecentlyViewed: () => void;
  isInRecentlyViewed: (offerId: string) => boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(
  undefined
);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Offer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setRecentlyViewed(parsed);
        }
      } catch (error) {
        console.error("Failed to load recently viewed:", error);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever recentlyViewed changes
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      try {
        localStorage.setItem(
          RECENTLY_VIEWED_KEY,
          JSON.stringify(recentlyViewed)
        );
      } catch (error) {
        console.error("Failed to save recently viewed:", error);
      }
    }
  }, [recentlyViewed, isLoaded]);

  const addToRecentlyViewed = useCallback((offer: Offer) => {
    setRecentlyViewed((prev) => {
      // Remove if already exists
      const filtered = prev.filter((item) => item.id !== offer.id);
      // Add to the beginning
      const updated = [offer, ...filtered];
      // Keep only max 10
      return updated.slice(0, MAX_RECENTLY_VIEWED);
    });
  }, []);

  const removeFromRecentlyViewed = useCallback((offerId: string) => {
    setRecentlyViewed((prev) => prev.filter((item) => item.id !== offerId));
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  const isInRecentlyViewed = useCallback(
    (offerId: string) => {
      return recentlyViewed.some((item) => item.id === offerId);
    },
    [recentlyViewed]
  );

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        removeFromRecentlyViewed,
        clearRecentlyViewed,
        isInRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error(
      "useRecentlyViewed must be used within a RecentlyViewedProvider"
    );
  }
  return context;
}
