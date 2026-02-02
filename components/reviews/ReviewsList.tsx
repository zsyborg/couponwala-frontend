'use client';

import { useState, useCallback } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, MoreVertical, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';
import { Rating, ReviewSortOption } from '@/types/rating';
import { StarRating } from './RatingDisplay';

interface ReviewsListProps {
  offerId: string;
  initialReviews?: Rating[];
  totalCount?: number;
  onLoadMore?: (page: number) => Promise<{ reviews: Rating[]; hasMore: boolean }>;
  className?: string;
}

// Demo reviews for development
const demoReviews: Rating[] = [
  {
    _id: '1',
    offerId: '1',
    userId: 'user1',
    user: { _id: 'user1', name: 'Rahul Sharma', avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=ff6b35&color=fff' },
    rating: 5,
    review: 'Excellent deal! Got the Netflix subscription at half price. Code worked instantly. Highly recommend!',
    isHelpful: 24,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    offerId: '1',
    userId: 'user2',
    user: { _id: 'user2', name: 'Priya Patel', avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=f97316&color=fff' },
    rating: 4,
    review: 'Good value for money. The subscription worked fine but delivery took a bit longer than expected.',
    isHelpful: 12,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    offerId: '1',
    userId: 'user3',
    user: { _id: 'user3', name: 'Amit Kumar', avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=ea580c&color=fff' },
    rating: 5,
    review: 'Perfect! Already redeemed and watching my favorite shows. CouponWala never disappoints!',
    isHelpful: 8,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    offerId: '1',
    userId: 'user4',
    user: { _id: 'user4', name: 'Sneha Gupta', avatar: 'https://ui-avatars.com/api/?name=Sneha+Gupta&background=ca8a04&color=fff' },
    rating: 3,
    review: 'Decent offer but the code had some issues initially. Support resolved it quickly though.',
    isHelpful: 5,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    offerId: '1',
    userId: 'user5',
    user: { _id: 'user5', name: 'Vikram Singh', avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=16a34a&color=fff' },
    rating: 4,
    review: 'Worth the money. Using it for my family and we all love it. Would buy again.',
    isHelpful: 15,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function ReviewsList({
  offerId,
  initialReviews = demoReviews,
  totalCount = demoReviews.length,
  onLoadMore,
  className,
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Rating[]>(initialReviews);
  const [sortBy, setSortBy] = useState<ReviewSortOption>('recent');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  const sortOptions: { value: ReviewSortOption; label: string }[] = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'highest', label: 'Highest Rating' },
    { value: 'lowest', label: 'Lowest Rating' },
    { value: 'helpful', label: 'Most Helpful' },
  ];

  const handleSort = useCallback((sort: ReviewSortOption) => {
    setSortBy(sort);
    let sorted = [...reviews];

    switch (sort) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'highest':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        sorted.sort((a, b) => b.isHelpful - a.isHelpful);
        break;
    }

    setReviews(sorted);
  }, [reviews]);

  const handleLoadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      if (onLoadMore) {
        const result = await onLoadMore(nextPage);
        setReviews((prev) => [...prev, ...result.reviews]);
        setHasMore(result.hasMore);
      } else {
        // Demo: simulate loading more
        await new Promise((resolve) => setTimeout(resolve, 500));
        setReviews((prev) => [...prev, ...demoReviews.map(r => ({ ...r, _id: `${r._id}_${nextPage}` }))]);
      }
      setPage(nextPage);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, onLoadMore]);

  const handleHelpful = useCallback((reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  }, []);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
          <p className="text-sm text-gray-500">{totalCount} reviews</p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value as ReviewSortOption)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            isHelpful={helpfulVotes[review._id]}
            onHelpful={() => handleHelpful(review._id)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            isLoading={isLoading}
            className="min-w-[140px]"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
}

// Individual Review Card
interface ReviewCardProps {
  review: Rating;
  isHelpful: boolean;
  onHelpful: () => void;
}

function ReviewCard({ review, isHelpful, onHelpful }: ReviewCardProps) {
  const [showFullReview, setShowFullReview] = useState(false);
  const maxLength = 200;
  const isLongReview = review.review && review.review.length > maxLength;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={review.user?.avatar || `https://ui-avatars.com/api/?name=${review.user?.name || 'User'}&background=ff6b35&color=fff`}
          alt={review.user?.name || 'User'}
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</h4>
              <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm font-medium text-gray-700">{review.rating}.0</span>
          </div>

          {/* Review Text */}
          <p className="text-gray-600 leading-relaxed mb-3">
            {isLongReview && !showFullReview
              ? `${review.review.slice(0, maxLength)}...`
              : review.review}
            {isLongReview && (
              <button
                onClick={() => setShowFullReview(!showFullReview)}
                className="text-orange-500 hover:text-orange-600 text-sm ml-1"
              >
                {showFullReview ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mb-3">
              {review.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
              {review.images.length > 4 && (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <ImageIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-xs text-gray-500 ml-1">+{review.images.length - 4}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onHelpful}
              className={cn(
                'flex items-center gap-1.5 text-sm transition-colors',
                isHelpful
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-orange-500'
              )}
            >
              <ThumbsUp className={cn('w-4 h-4', isHelpful && 'fill-current')} />
              <span>Helpful ({review.isHelpful + (isHelpful ? 1 : 0)})</span>
            </button>
            <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for loading state
export function ReviewsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-full bg-gray-200 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
