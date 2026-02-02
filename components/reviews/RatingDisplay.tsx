'use client';

import { Star, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RatingSummary } from '@/types/rating';

interface RatingDisplayProps {
  summary: RatingSummary;
  className?: string;
}

export function RatingDisplay({ summary, className }: RatingDisplayProps) {
  const { averageRating, totalReviews, distribution, percentageDistribution } = summary;

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-gray-100', className)}>
      {/* Header */}
      <div className="flex items-start gap-6 mb-6">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900 mb-1">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-5 h-5',
                  star <= Math.round(averageRating)
                    ? 'fill-orange-500 text-orange-500'
                    : 'fill-gray-200 text-gray-200'
                )}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">{totalReviews} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{rating}★</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentageDistribution[rating as keyof typeof percentageDistribution]}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-10">
                {percentageDistribution[rating as keyof typeof percentageDistribution]}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">5★</p>
            <p className="text-xs text-gray-500">{distribution[5]}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">4★</p>
            <p className="text-xs text-gray-500">{distribution[4]}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">3★</p>
            <p className="text-xs text-gray-500">{distribution[3]}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">2★</p>
            <p className="text-xs text-gray-500">{distribution[2]}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">1★</p>
            <p className="text-xs text-gray-500">{distribution[1]}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <ThumbsUp className="w-4 h-4" />
          <span>Based on {totalReviews} reviews</span>
        </div>
      </div>
    </div>
  );
}

// Star Rating Component for interactive use
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(rating);
        const isHalf = !isFilled && starValue - 0.5 <= rating;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            className={cn(
              'transition-transform',
              interactive && 'hover:scale-110',
              !interactive && 'cursor-default'
            )}
          >
            <Star
              className={cn(
                sizes[size],
                isFilled
                  ? 'fill-orange-500 text-orange-500'
                  : isHalf
                  ? 'fill-orange-300 text-orange-300'
                  : 'fill-gray-200 text-gray-200'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

// Skeleton for loading state
export function RatingDisplaySkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="flex items-start gap-6">
        <div className="text-center w-24">
          <div className="h-12 w-16 bg-gray-200 rounded mb-2 mx-auto" />
          <div className="h-4 w-20 bg-gray-200 rounded mx-auto" />
        </div>
        <div className="flex-1 space-y-3">
          {[5, 4, 3, 2, 1].map(() => (
            <div className="flex items-center gap-3">
              <div className="h-4 w-8 bg-gray-200 rounded" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full" />
              <div className="h-4 w-10 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
