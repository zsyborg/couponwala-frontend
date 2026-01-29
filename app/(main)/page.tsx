"use client";

import Link from "next/link";
import { ArrowRight, Tag, Shield, Zap, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { OfferCard } from "@/components/offers/OfferCard";
import { useCartStore } from "@/store/useCartStore";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { Offer } from "@/types";

// Demo featured offers
const featuredOffers: Offer[] = [
  {
    id: "1",
    serviceName: "Netflix 1 Month Subscription",
    description: "Get 1 month of Netflix premium subscription at 50% off.",
    originalPrice: 799,
    discountedPrice: 399,
    discountPercentage: 50,
    category: "Streaming",
    store: "Netflix",
    couponCode: "NETFLIX50",
    imageUrl: "https://via.placeholder.com/400x300",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    serviceName: "Spotify Premium 3 Months",
    description: "Enjoy 3 months of ad-free music with Spotify Premium.",
    originalPrice: 1197,
    discountedPrice: 599,
    discountPercentage: 50,
    category: "Music",
    store: "Spotify",
    couponCode: "SPOTIFY50",
    imageUrl: "https://via.placeholder.com/400x300",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    serviceName: "Amazon Prime Yearly",
    description: "Full year Amazon Prime membership with free delivery.",
    originalPrice: 1499,
    discountedPrice: 999,
    discountPercentage: 33,
    category: "Shopping",
    store: "Amazon",
    couponCode: "PRIME33",
    imageUrl: "https://via.placeholder.com/400x300",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    serviceName: "Disney+ Hotstar VIP",
    description: "Access to exclusive Disney+ and Hotstar content.",
    originalPrice: 1499,
    discountedPrice: 699,
    discountPercentage: 53,
    category: "Streaming",
    store: "Disney+",
    couponCode: "DISNEY50",
    imageUrl: "https://via.placeholder.com/400x300",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const categories = [
  { name: "Streaming", icon: "📺", count: 25 },
  { name: "Music", icon: "🎵", count: 18 },
  { name: "Shopping", icon: "🛍️", count: 32 },
  { name: "Food", icon: "🍔", count: 15 },
  { name: "Travel", icon: "✈️", count: 12 },
  { name: "Gaming", icon: "🎮", count: 22 },
];

const features = [
  {
    icon: Tag,
    title: "Best Deals",
    description: "We negotiate the best discounts so you save more",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your transactions are safe and protected",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Get your coupons delivered instantly via email",
  },
  {
    icon: CreditCard,
    title: "Easy Payment",
    description: "Multiple payment options for your convenience",
  },
];

export default function HomePage() {
  const { openCart } = useCartStore();

  return (
    <div className="min-h-screen">
      <CartSidebar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">🎉 Up to 70% Off on Popular Services</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Discover Amazing{" "}
              <span className="text-primary">Deals & Coupons</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Save money on your favorite streaming services, shopping, food delivery,
              and more with exclusive discount coupons.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/offers">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Offers
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={openCart}
              >
                View Cart
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <Link href="/offers" className="text-primary hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.name} href={`/offers?category=${category.name}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-3 block">{category.icon}</span>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} offers
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Offers Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Featured Offers</h2>
            <Link href="/offers" className="text-primary hover:underline text-sm">
              View All Offers
              <ArrowRight className="inline ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Start Saving?
              </h2>
              <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                Join thousands of happy customers who are already saving money
                with CouponWala. Sign up now and get exclusive access to
                premium deals!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" variant="secondary">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/offers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    Browse Deals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
