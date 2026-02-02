'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import { Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RelatedOffersCarouselProps {
  offers: Offer[];
  title?: string;
}

export function RelatedOffersCarousel({ offers, title = 'Similar Offers' }: RelatedOffersCarouselProps) {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link 
          href="/offers" 
          className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {offers.map((offer) => {
          const discount = calculateDiscount(offer.originalPrice, offer.discountedPrice);
          
          return (
            <Link
              key={offer.id}
              href={`/offers/${offer.id}`}
              className="flex-shrink-0 w-72 sm:w-80"
            >
              <Card hoverEffect className="h-full overflow-hidden group">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={offer.imageUrl || 'https://via.placeholder.com/600x400'}
                    alt={offer.serviceName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge 
                    variant="error" 
                    className="absolute top-3 left-3"
                  >
                    {discount}% OFF
                  </Badge>
                </div>
                <CardBody className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="default" className="text-xs">
                      {offer.category}
                    </Badge>
                    {offer.store && (
                      <span className="text-xs text-gray-500">{offer.store}</span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {offer.serviceName}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.5</span>
                    <span className="text-sm text-gray-500">(128 reviews)</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-orange-500">
                      {formatCurrency(offer.discountedPrice)}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(offer.originalPrice)}
                    </span>
                  </div>
                  
                  {offer.couponCode && (
                    <div className="mt-3 p-2 bg-gray-100 rounded text-center">
                      <code className="text-sm font-mono font-medium text-gray-700">
                        {offer.couponCode}
                      </code>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// Skeleton loader for related offers
export function RelatedOffersSkeleton() {
  return (
    <section className="mt-12 pt-8 border-t border-gray-100">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-shrink-0 w-72">
            <div className="bg-gray-200 aspect-[16/9] rounded-t-xl animate-pulse" />
            <div className="p-4 space-y-3 bg-white rounded-b-xl border border-gray-100">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
