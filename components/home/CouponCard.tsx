"use client";

import { useState } from "react";
import {
  Percent,
  Tag,
  Copy,
  Check,
  Clock,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export type CouponType =
  | "percentage"
  | "flat"
  | "bogo"
  | "promo";

interface CouponCardProps {
  type: CouponType;
  brand: string;
  brandLogo: string;
  title: string;
  discount: string;
  code?: string;
  expiryDate: string;
  terms: string;
  isExpiringSoon?: boolean;
}

const typeConfig = {
  percentage: {
    icon: <Percent className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    badge: "Percentage Off",
  },
  flat: {
    icon: <Tag className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    badge: "Flat Discount",
  },
  bogo: {
    icon: (
      <div className="flex items-center gap-0.5">
        <span className="text-sm font-bold">2</span>
        <span className="text-lg">for</span>
        <span className="text-sm font-bold">1</span>
      </div>
    ),
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    badge: "BOGO Offer",
  },
  promo: {
    icon: <Tag className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    badge: "Promo Code",
  },
};

export function CouponCard({
  type,
  brand,
  brandLogo,
  title,
  discount,
  code,
  expiryDate,
  terms,
  isExpiringSoon = false,
}: CouponCardProps) {
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const config = typeConfig[type];

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${config.bgColor} border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
    >
      {/* Top Section */}
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`w-14 h-14 ${config.iconBg} rounded-xl flex items-center justify-center ${config.iconColor} flex-shrink-0`}
          >
            {config.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Badge & Brand */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-0.5 rounded">
                {brand}
              </span>
              <span
                className={`text-xs font-semibold text-white px-2 py-0.5 rounded bg-gradient-to-r ${config.color}`}
              >
                {config.badge}
              </span>
              {isExpiringSoon && (
                <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Ending Soon
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {title}
            </h3>

            {/* Discount */}
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                {discount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Section */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-3">
          {code ? (
            <>
              <div
                className={`flex-1 h-12 bg-white rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-between px-4 cursor-pointer hover:border-gray-300 transition-colors`}
                onClick={handleCopy}
              >
                <span className="font-mono font-semibold text-gray-700">
                  {isRevealed || copied ? code : "XXXXXX"}
                </span>
                <button
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRevealed(!isRevealed);
                  }}
                >
                  {isRevealed ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Revealed</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Reveal</span>
                    </>
                  )}
                </button>
              </div>
              <Button
                size="md"
                className={`h-12 px-6 bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              className={`flex-1 h-12 bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              Get Deal
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Valid until {formatDate(expiryDate)}</span>
          </div>
          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <span>Terms</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Terms Tooltip */}
        <div className="mt-3 p-3 bg-white rounded-lg text-xs text-gray-500 hidden group-hover:block">
          {terms}
        </div>
      </div>

      {/* Decorative Element */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.color} opacity-5 rounded-bl-full`}
      ></div>
    </div>
  );
}

// Demo component to showcase different coupon types
export function CouponShowcase() {
  const demoCoupons: CouponCardProps[] = [
    {
      type: "percentage",
      brand: "Amazon",
      brandLogo: "A",
      title: "Extra 10% Off on All Electronics",
      discount: "10% OFF",
      code: "ELECTRO10",
      expiryDate: "2024-02-28",
      terms: "Valid on orders above ₹500. Maximum discount ₹200. Not valid on bundled products.",
      isExpiringSoon: false,
    },
    {
      type: "flat",
      brand: "Swiggy",
      brandLogo: "S",
      title: "Flat ₹150 Off on First Order",
      discount: "₹150 OFF",
      code: "FIRST150",
      expiryDate: "2024-01-31",
      terms: "Valid for new users only. Minimum order value ₹299. Cannot be combined with other offers.",
      isExpiringSoon: true,
    },
    {
      type: "bogo",
      brand: "Dominos",
      brandLogo: "D",
      title: "Buy 1 Get 1 Free on Medium Pizzas",
      discount: "BOGO",
      code: "BOGOMED",
      expiryDate: "2024-02-15",
      terms: "Valid on select medium pizzas only. Valid for home delivery only. Cannot be combined with other offers.",
      isExpiringSoon: false,
    },
    {
      type: "promo",
      brand: "Myntra",
      brandLogo: "M",
      title: "Special Access: Private Sale",
      discount: "UPTO 70%",
      code: "PRIVATE70",
      expiryDate: "2024-02-20",
      terms: "Exclusive for registered users. Valid on select brands only. Returns not applicable on sale items.",
      isExpiringSoon: false,
    },
    {
      type: "percentage",
      brand: "Zomato",
      brandLogo: "Z",
      title: "25% Off on Orders Above ₹350",
      discount: "25% OFF",
      code: "ZOMATO25",
      expiryDate: "2024-02-10",
      terms: "Valid on orders above ₹350. Maximum discount ₹100. Valid once per user per day.",
      isExpiringSoon: false,
    },
    {
      type: "flat",
      brand: "MakeMyTrip",
      brandLogo: "M",
      title: "₹1000 Off on Flight Bookings",
      discount: "₹1000 OFF",
      code: "FLIGHT1000",
      expiryDate: "2024-03-31",
      terms: "Valid on domestic flights only. Minimum booking ₹5000. Valid on select airlines only.",
      isExpiringSoon: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {demoCoupons.map((coupon, index) => (
        <CouponCard key={index} {...coupon} />
      ))}
    </div>
  );
}
