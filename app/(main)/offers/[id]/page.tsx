"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ShoppingCart, Tag, Store, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Offer } from "@/types";
import { formatCurrency, calculateDiscount, formatDate } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

// Demo offer data
const demoOffer: Offer = {
  id: "1",
  serviceName: "Netflix 1 Month Subscription",
  description:
    "Get 1 month of Netflix premium subscription at 50% off. Valid for new users only. Enjoy unlimited access to thousands of TV shows, movies, and Netflix originals on all your devices. This offer includes 4K streaming quality and the ability to watch on multiple screens simultaneously.",
  originalPrice: 799,
  discountedPrice: 399,
  discountPercentage: 50,
  category: "Streaming",
  store: "Netflix",
  couponCode: "NETFLIX50",
  imageUrl: "https://via.placeholder.com/600x400",
  isActive: true,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export default function OfferDetailPage() {
  const params = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    // In production, fetch from API
    // const fetchOffer = async () => {
    //   const response = await offersApi.getById(params.id as string);
    //   setOffer(response.data);
    //   setIsLoading(false);
    // };
    // fetchOffer();

    // Using demo data
    setTimeout(() => {
      setOffer(demoOffer);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const handleAddToCart = () => {
    if (offer) {
      addItem(offer);
    }
  };

  const handleCopyCode = () => {
    if (offer) {
      navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80 bg-muted rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-12 bg-muted rounded w-1/3 mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Offer Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The offer you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/offers">
          <Button>Browse All Offers</Button>
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(offer.originalPrice, offer.discountedPrice);
  const savings = offer.originalPrice - offer.discountedPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/offers"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Offers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
            {offer.imageUrl ? (
              <img
                src={offer.imageUrl}
                alt={offer.serviceName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Tag className="h-20 w-20 text-muted-foreground" />
              </div>
            )}
            <Badge variant="destructive" className="absolute top-4 left-4 text-lg px-3 py-1">
              {discount}% OFF
            </Badge>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{offer.category}</Badge>
              <Badge variant="outline">{offer.store}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{offer.serviceName}</h1>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-primary">
              {formatCurrency(offer.discountedPrice)}
            </span>
            <div className="flex flex-col">
              <span className="text-xl text-muted-foreground line-through">
                {formatCurrency(offer.originalPrice)}
              </span>
              <span className="text-sm text-green-600">
                Save {formatCurrency(savings)}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{offer.description}</p>

          {/* Features */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Instant delivery via email</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Valid for 12 months from purchase</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Can be used on new or existing accounts</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>24/7 customer support</span>
              </div>
            </CardContent>
          </Card>

          {/* Coupon Code */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Use this coupon code at checkout
                  </p>
                  <p className="text-2xl font-mono font-bold">{offer.couponCode}</p>
                </div>
                <Button
                  variant={copied ? "secondary" : "outline"}
                  onClick={handleCopyCode}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Expiry */}
          {offer.expiresAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Offer expires on {formatDate(offer.expiresAt)}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
