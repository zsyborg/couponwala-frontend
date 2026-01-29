"use client";

import {
  Shirt,
  Smartphone,
  Utensils,
  Plane,
  Heart,
  Home,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Category {
  id: number;
  name: string;
  icon: React.ReactNode;
  image: string;
  brandCount: number;
  offerCount: number;
  brands: string[];
}

const categories: Category[] = [
  {
    id: 1,
    name: "Fashion",
    icon: <Shirt className="w-8 h-8" />,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    brandCount: 245,
    offerCount: 1200,
    brands: ["Myntra", "AJIO", "Zara", "H&M", "Forever 21"],
  },
  {
    id: 2,
    name: "Electronics",
    icon: <Smartphone className="w-8 h-8" />,
    image:
      "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=400&fit=crop",
    brandCount: 180,
    offerCount: 890,
    brands: ["Amazon", "Flipkart", "Croma", "Reliance Digital", "Snapdeal"],
  },
  {
    id: 3,
    name: "Food & Dining",
    icon: <Utensils className="w-8 h-8" />,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    brandCount: 320,
    offerCount: 2100,
    brands: ["Swiggy", "Zomato", "Dominos", "Pizza Hut", "KFC"],
  },
  {
    id: 4,
    name: "Travel",
    icon: <Plane className="w-8 h-8" />,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop",
    brandCount: 95,
    offerCount: 450,
    brands: ["MakeMyTrip", "Cleartrip", "Yatra", "Goibibo", "Booking.com"],
  },
  {
    id: 5,
    name: "Health & Beauty",
    icon: <Heart className="w-8 h-8" />,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=600&h=400&fit=crop",
    brandCount: 156,
    offerCount: 780,
    brands: ["Nykaa", "Purplle", "Myntra Beauty", "Sephora", "HealthKart"],
  },
  {
    id: 6,
    name: "Home & Living",
    icon: <Home className="w-8 h-8" />,
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
    brandCount: 128,
    offerCount: 620,
    brands: ["Amazon", "Flipkart", "Pepperfry", "Urban Ladder", "IKEA"],
  },
];

const categoryColors = [
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-amber-500",
  "from-purple-500 to-indigo-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
];

export function CategoryShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-600 hover:bg-purple-100">
            🏪 Browse Categories
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore deals across your favorite categories and find the perfect
            offer for you.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-3xl bg-gray-900 cursor-pointer"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${categoryColors[index]} opacity-50 group-hover:opacity-70 transition-opacity`}
                ></div>
              </div>

              {/* Content */}
              <div className="relative p-8 h-full flex flex-col justify-between min-h-[320px]">
                {/* Icon & Name */}
                <div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-4 text-white/80 text-sm">
                    <span>{category.brandCount}+ Brands</span>
                    <span>•</span>
                    <span>{category.offerCount}+ Offers</span>
                  </div>
                </div>

                {/* Bottom Section */}
                <div>
                  {/* Brand Logos */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.brands.slice(0, 4).map((brand, i) => (
                      <span
                        key={brand}
                        className="text-xs bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full"
                      >
                        {brand}
                      </span>
                    ))}
                    {category.brands.length > 4 && (
                      <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                        +{category.brands.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* View All Link */}
                  <div className="flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
                    <span className="font-medium">View All {category.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Hover Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200"
          >
            View All Categories
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
