'use client';

import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, calculateDiscount } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Tag, TrendingDown, Wallet } from 'lucide-react';

interface PricingSectionProps {
  originalPrice: number;
  discountedPrice: number;
  couponCode?: string;
}

export function PricingSection({ 
  originalPrice, 
  discountedPrice, 
  couponCode 
}: PricingSectionProps) {
  const discount = calculateDiscount(originalPrice, discountedPrice);
  const savings = originalPrice - discountedPrice;

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
      <CardBody className="p-6 space-y-4">
        {/* Discount Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="error" className="text-lg px-3 py-1">
            <TrendingDown className="w-4 h-4 mr-1" />
            {discount}% OFF
          </Badge>
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <Tag className="w-4 h-4" />
            Limited time offer
          </span>
        </div>

        {/* Price Display */}
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-gray-900">
            {formatCurrency(discountedPrice)}
          </span>
          <span className="text-xl text-gray-400 line-through">
            {formatCurrency(originalPrice)}
          </span>
        </div>

        {/* Savings */}
        {savings > 0 && (
          <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg">
            <Wallet className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">
              You save {formatCurrency(savings)} on this deal!
            </span>
          </div>
        )}

        {/* Price breakdown (optional for multi-quantity) */}
        <div className="pt-4 border-t border-orange-200/50">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Original Price:</span>
            <span className="line-through text-gray-400">{formatCurrency(originalPrice)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Discount ({discount}%):</span>
            <span className="text-green-600 font-medium">-{formatCurrency(savings)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1 pt-2 border-t border-orange-200/50">
            <span className="text-gray-900 font-medium">Final Price:</span>
            <span className="text-orange-600 font-bold">{formatCurrency(discountedPrice)}</span>
          </div>
        </div>

        {/* Payment Methods */}
        {couponCode && (
          <div className="pt-4 border-t border-orange-200/50">
            <p className="text-xs text-gray-500 mb-2">Accepted Payment Methods</p>
            <div className="flex flex-wrap gap-2">
              {['UPI', 'Cards', 'Net Banking', 'Wallets'].map((method) => (
                <span 
                  key={method}
                  className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
