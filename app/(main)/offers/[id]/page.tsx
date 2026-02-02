'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Share2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Offer } from '@/types';
import { offers, favorites } from '@/lib/api';
import { RatingSummary } from '@/types/rating';
import { useCartStore } from '@/store/useCartStore';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import { cn } from '@/lib/utils';
import {
  OfferImageGallery,
  CouponCodeSection,
  PurchaseSection,
  RelatedOffersCarousel,
  RelatedOffersSkeleton,
  OfferDetailsSection,
  PricingSection,
} from '@/components/offers';
import { RatingDisplay, ReviewsList, WriteReview, RatingDisplaySkeleton, ReviewsListSkeleton } from '@/components/reviews';

// Demo data for development
const demoOffer: Offer = {
  id: '1',
  serviceName: 'Netflix 1 Month Premium Subscription',
  description: `Get 1 month of Netflix premium subscription at 50% off. Valid for new users only. Enjoy unlimited access to thousands of TV shows, movies, and Netflix originals on all your devices. This offer includes 4K streaming quality and the ability to watch on multiple screens simultaneously.

  With Netflix Premium, you get:
  • Ad-free streaming in 4K Ultra HD
  • Watch on 4 screens at once
  • Download on 4 devices
  • Exclusive Netflix original series and movies
  • New content added every week
  • Cancel anytime

  This is a digital code that will be delivered via email within 2 minutes of purchase. The code can be redeemed on Netflix.com or through the Netflix app. Perfect gift for friends and family!`,
  originalPrice: 799,
  discountedPrice: 399,
  discountPercentage: 50,
  category: 'Streaming',
  store: 'Netflix',
  couponCode: 'NETFLIX50',
  imageUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=600&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8efe85?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&h=600&fit=crop',
  ],
  rating: 4.3,
  reviewCount: 127,
  isActive: true,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

const demoRelatedOffers: Offer[] = [
  {
    id: '2',
    serviceName: 'Amazon Prime 3 Months',
    description: 'Get 3 months of Amazon Prime at discounted price',
    originalPrice: 599,
    discountedPrice: 399,
    discountPercentage: 33,
    category: 'Streaming',
    store: 'Amazon',
    couponCode: 'PRIME33',
    imageUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&h=400&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    serviceName: 'Spotify Premium 6 Months',
    description: '6 months of ad-free music streaming',
    originalPrice: 719,
    discountedPrice: 479,
    discountPercentage: 33,
    category: 'Music',
    store: 'Spotify',
    couponCode: 'SPOTIFY6',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=600&h=400&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    serviceName: 'Disney+ Hotstar 1 Year',
    description: 'Annual subscription with premium content',
    originalPrice: 1499,
    discountedPrice: 999,
    discountPercentage: 33,
    category: 'Streaming',
    store: 'Disney+',
    couponCode: 'DISNEY33',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&h=400&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    serviceName: 'YouTube Premium 6 Months',
    description: 'Ad-free videos and YouTube Music',
    originalPrice: 780,
    discountedPrice: 520,
    discountPercentage: 33,
    category: 'Streaming',
    store: 'YouTube',
    couponCode: 'YOUTUBE6',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export default function OfferDetailPage() {
  const params = useParams();
  const { addItem, openCart } = useCartStore();
  const { addToRecentlyViewed } = useRecentlyViewed();
  
  const [offer, setOffer] = useState<Offer | null>(null);
  const [relatedOffers, setRelatedOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [ratingSummary, setRatingSummary] = useState<RatingSummary | null>(null);
  const [hasPurchased, setHasPurchased] = useState(true); // Demo: assume user purchased

  const offerId = params?.id as string;

  // Fetch offer data
  useEffect(() => {
    const fetchOfferData = async () => {
      if (!offerId) return;

      setIsLoading(true);
      setError(null);

      try {
        // In production, uncomment this:
        // const response = await offers.getById(offerId);
        // setOffer(response.offer);
        // setRelatedOffers(response.relatedOffers || []);

        // Using demo data for development
        await new Promise(resolve => setTimeout(resolve, 500));
        setOffer(demoOffer);
        setRelatedOffers(demoRelatedOffers);
        
        // Add to recently viewed
        addToRecentlyViewed(demoOffer);
        
        // Load rating summary (demo)
        setRatingSummary({
          averageRating: 4.3,
          totalReviews: 127,
          distribution: { 5: 78, 4: 32, 3: 12, 2: 3, 1: 2 },
          percentageDistribution: { 5: 61, 4: 25, 3: 9, 2: 3, 1: 2 },
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load offer');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOfferData();
  }, [offerId, addToRecentlyViewed]);

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Handle review submission success
  const handleReviewSubmit = useCallback(() => {
    showToast('Review submitted successfully!', 'success');
  }, [showToast]);

  // Toggle favorite
  const handleToggleFavorite = async () => {
    try {
      setIsFavorite(!isFavorite);
      showToast(
        isFavorite ? 'Removed from favorites' : 'Added to favorites',
        'success'
      );
    } catch {
      showToast('Failed to update favorites', 'error');
    }
  };

  // Share functionality
  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: offer?.serviceName,
          text: `Check out this amazing deal: ${offer?.serviceName}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Link copied to clipboard!', 'success');
      } catch {
        showToast('Failed to copy link', 'error');
      }
    }
  };

  // Add to cart with notification
  const handleAddToCart = () => {
    if (offer) {
      addItem(offer);
      showToast('Added to cart!', 'success');
      openCart();
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6 animate-pulse">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-video bg-gray-200 rounded-xl animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Details skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-16 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <RelatedOffersSkeleton />
      </div>
    );
  }

  // Error state
  if (error || !offer) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Offer Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The offer you're looking for doesn't exist or has been removed."}
          </p>
          <Link href="/offers">
            <Button>Browse All Offers</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = (offer as any).images || (offer.imageUrl ? [offer.imageUrl] : []);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Toast notification */}
      {toast && (
        <div className={cn(
          "fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg animate-in slide-in-from-bottom-5",
          toast.type === 'success' 
            ? "bg-green-500 text-white" 
            : "bg-red-500 text-white"
        )}>
          {toast.message}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Offers', href: '/offers' },
          { label: offer.serviceName },
        ]}
        className="mb-6"
      />

      {/* Back Button (mobile) */}
      <Link
        href="/offers"
        className="inline-flex items-center text-gray-600 hover:text-orange-500 mb-4 lg:hidden transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Offers
      </Link>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Left Column - Image Gallery */}
        <div className="order-1 lg:order-1">
          <OfferImageGallery 
            images={images} 
            offerTitle={offer.serviceName}
          />
        </div>

        {/* Right Column - Details */}
        <div className="order-2 lg:order-2 space-y-6">
          <OfferDetailsSection
            store={offer.store}
            title={offer.serviceName}
            description={offer.description}
            category={offer.category}
            expiresAt={offer.expiresAt}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            onShare={handleShare}
          />

          {/* Pricing */}
          <PricingSection
            originalPrice={offer.originalPrice}
            discountedPrice={offer.discountedPrice}
            couponCode={offer.couponCode}
          />

          {/* Coupon Code */}
          {offer.couponCode && (
            <CouponCodeSection
              code={offer.couponCode}
              offerTitle={offer.store || offer.serviceName}
              onCopy={() => showToast('Coupon code copied!', 'success')}
            />
          )}

          {/* Purchase Section */}
          <PurchaseSection
            offer={offer}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Related Offers */}
      <RelatedOffersCarousel 
        offers={relatedOffers}
        title="Similar Offers You Might Like"
      />

      {/* Ratings & Reviews Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ratings & Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Rating Summary */}
          <div className="lg:col-span-1">
            {ratingSummary ? (
              <RatingDisplay summary={ratingSummary} />
            ) : (
              <RatingDisplaySkeleton />
            )}
          </div>
          
          {/* Right Column - Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {ratingSummary ? (
              <>
                <ReviewsList 
                  offerId={offerId}
                  totalCount={ratingSummary.totalReviews}
                />
                
                {/* Write Review Form */}
                {hasPurchased && (
                  <WriteReview 
                    offerId={offerId}
                    onSubmitSuccess={handleReviewSubmit}
                  />
                )}
              </>
            ) : (
              <ReviewsListSkeleton />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
