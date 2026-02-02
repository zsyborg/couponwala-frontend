'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OfferImageGalleryProps {
  images: string[];
  offerTitle: string;
}

export function OfferImageGallery({ images, offerTitle }: OfferImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const displayImages = images && images.length > 0 
    ? images 
    : ['https://via.placeholder.com/600x400'];

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleMainImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className={cn(
          "relative rounded-xl overflow-hidden bg-muted aspect-video cursor-zoom-in transition-all duration-300",
          isZoomed ? "fixed inset-4 z-50 cursor-zoom-out" : ""
        )}
        onClick={handleMainImageClick}
      >
        {isZoomed && (
          <div 
            className="fixed inset-0 bg-black/80 z-40" 
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(false);
            }}
          />
        )}
        <Image
          src={displayImages[selectedIndex]}
          alt={`${offerTitle} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
        
        {/* Discount Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-red-500 text-white text-lg font-bold px-3 py-1 rounded-lg">
            Sale
          </span>
        </div>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                index === selectedIndex 
                  ? "border-orange-500" 
                  : "border-transparent hover:border-gray-300"
              )}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
