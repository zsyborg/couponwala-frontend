'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';

interface CouponCodeSectionProps {
  code: string;
  offerTitle: string;
  onCopy?: () => void;
}

export function CouponCodeSection({ code, offerTitle, onCopy }: CouponCodeSectionProps) {
  const [copied, setCopied] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
      <CardBody className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-orange-800 font-medium mb-1">
              Use this code at checkout
            </p>
            <div className="flex items-center gap-2">
              <code className="text-2xl font-bold font-mono text-gray-900 bg-white px-4 py-2 rounded-lg border-2 border-orange-200">
                {isRevealed ? code : '••••••••'}
              </code>
              <button
                onClick={() => setIsRevealed(!isRevealed)}
                className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                title={isRevealed ? 'Hide code' : 'Reveal code'}
              >
                {isRevealed ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button
            variant={copied ? 'secondary' : 'primary'}
            onClick={handleCopy}
            className={cn(
              "min-w-[120px]",
              copied && "bg-green-500 hover:bg-green-600 text-white"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-orange-700 mt-3">
          <span className="font-medium">Tip:</span> Copy the code and apply it during checkout on the {offerTitle} website or app.
        </p>
      </CardBody>
    </Card>
  );
}
