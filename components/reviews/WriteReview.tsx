'use client';

import { useState, useCallback } from 'react';
import { Star, Image, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { offers } from '@/lib/api';

interface WriteReviewProps {
  offerId: string;
  onSubmitSuccess?: () => void;
  className?: string;
}

export function WriteReview({ offerId, onSubmitSuccess, className }: WriteReviewProps) {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // For demo, create local URLs
    Array.from(files).forEach((file) => {
      if (images.length < 5) {
        const url = URL.createObjectURL(file);
        setImages((prev) => [...prev, url]);
      }
    });
  }, [images.length]);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (review.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In production, uncomment this:
      // await offers.rate(offerId, rating, review);
      
      // Demo: simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Reset form
      setRating(0);
      setReview('');
      setImages([]);
      
      onSubmitSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  }, [offerId, rating, review, images, onSubmitSuccess]);

  const handleLoginPrompt = useCallback(() => {
    // Redirect to login or show login modal
    window.location.href = '/login';
  }, []);

  if (authLoading) {
    return <WriteReviewSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className={cn('bg-gray-50 rounded-xl p-6 text-center', className)}>
        <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to write a review</h3>
        <p className="text-gray-500 mb-4">
          Share your experience with other customers by writing a review.
        </p>
        <Button onClick={handleLoginPrompt}>
          Sign In to Review
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-gray-100', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    'w-8 h-8 transition-colors',
                    star <= (hoveredRating || rating)
                      ? 'fill-orange-500 text-orange-500'
                      : 'fill-gray-200 text-gray-200'
                  )}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this offer..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {review.length}/1000 characters
            </span>
            <span className="text-xs text-gray-500">
              Min 10 characters
            </span>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                <Image className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500 mt-1">Add</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Upload up to 5 images (optional)
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setRating(0);
              setReview('');
              setImages([]);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={rating === 0 || review.length < 10}
          >
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
}

// Skeleton for loading state
function WriteReviewSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-24 w-full bg-gray-200 rounded" />
        <div className="h-10 w-full bg-gray-200 rounded" />
        <div className="flex justify-end gap-3">
          <div className="h-10 w-20 bg-gray-200 rounded" />
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
