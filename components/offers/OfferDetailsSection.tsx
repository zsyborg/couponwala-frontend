'use client';

import { useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, cn } from '@/lib/utils';
import { Star, Calendar, Store, Tag, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';

interface OfferDetailsSectionProps {
  store: string;
  title: string;
  description: string;
  category: string;
  expiresAt?: string;
  rating?: number;
  reviewCount?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onShare?: () => void;
}

export function OfferDetailsSection({
  store,
  title,
  description,
  category,
  expiresAt,
  rating = 4.5,
  reviewCount = 128,
  isFavorite = false,
  onToggleFavorite,
  onShare,
}: OfferDetailsSectionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxDescriptionLength = 200;

  const shouldTruncate = description.length > maxDescriptionLength;
  const displayDescription = shouldTruncate && !showFullDescription
    ? description.slice(0, maxDescriptionLength) + '...'
    : description;

  return (
    <div className="space-y-6">
      {/* Category & Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="primary">{category}</Badge>
        {store && (
          <Badge variant="default">
            <Store className="w-3 h-3 mr-1" />
            {store}
          </Badge>
        )}
        <Badge variant="info">Verified</Badge>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>

      {/* Rating */}
      {rating > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-5 h-5",
                  star <= Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="font-medium">{rating}</span>
          <span className="text-gray-500">({reviewCount} reviews)</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFavorite}
          className={cn(
            isFavorite && "text-red-500 bg-red-50 hover:bg-red-100"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Description */}
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 leading-relaxed">
          {displayDescription}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 mt-2"
          >
            {showFullDescription ? (
              <>
                Show Less
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Read More
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Features/Benefits */}
      <Card>
        <CardBody className="p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-orange-500" />
            What's Included
          </h3>
          <ul className="grid sm:grid-cols-2 gap-3">
            {[
              'Instant delivery via email',
              'Valid for 12 months',
        'Works on new & existing accounts',
              '24/7 customer support',
              'Secure payment',
              'Easy redemption process',
            ].map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      {/* Validity */}
      {expiresAt && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Offer valid until <strong>{formatDate(expiresAt)}</strong></span>
        </div>
      )}
    </div>
  );
}
