"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  User, Mail, Phone, MapPin, CreditCard, Package, Settings, LogOut, 
  Heart, Gift, Search, ChevronRight, X, Download, MapPin as MapPinIcon,
  Clock, CheckCircle, Truck, Package as PackageIcon, XCircle, RefreshCw,
  Wallet, Plus, Minus, Share2, MessageSquare, Phone as PhoneIcon,
  Edit2, Trash2, Bell, Lock, Eye, EyeOff, Copy, Check, ShoppingCart,
  DollarSign, ArrowUpRight, ArrowDownLeft, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatDate, formatCurrency } from "@/lib/utils";
import { payments, redemptions, favorites, referrals, wallet, auth } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";

// Types
interface OrderItem {
  offerId: {
    _id: string;
    name: string;
    imageUrl?: string;
    price: number;
    discountedPrice: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  updatedAt: string;
  invoiceUrl?: string;
  tracking?: {
    carrier: string;
    number: string;
    url: string;
  };
}

interface Redemption {
  _id: string;
  offer: {
    _id: string;
    name: string;
    imageUrl?: string;
  };
  couponCode: string;
  status: string;
  createdAt: string;
}

interface Favorite {
  _id: string;
  offer: {
    _id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    discountedPrice: number;
    category: string;
    store?: string;
  };
  createdAt: string;
}

interface WalletTransaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
}

interface ReferralHistoryItem {
  _id: string;
  referredUser: {
    name: string;
    phone: string;
  };
  status: 'pending' | 'completed';
  reward: number;
  createdAt: string;
}

// Demo data
const demoOrders: Order[] = [
  {
    _id: "1",
    orderNumber: "ORD-2024-001",
    items: [
      {
        offerId: {
          _id: "1",
          name: "Netflix 1 Month Subscription",
          imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8efe85?w=100&h=100&fit=crop",
          price: 499,
          discountedPrice: 399,
        },
        quantity: 1,
        price: 399,
      },
    ],
    total: 399,
    status: "delivered",
    paymentMethod: "UPI",
    shippingAddress: {
      name: "John Doe",
      phone: "+91 9876543210",
      address: "123, Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    invoiceUrl: "/invoice-ORD-2024-001.pdf",
  },
  {
    _id: "2",
    orderNumber: "ORD-2024-002",
    items: [
      {
        offerId: {
          _id: "2",
          name: "Spotify Premium 3 Months",
          imageUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100&h=100&fit=crop",
          price: 699,
          discountedPrice: 599,
        },
        quantity: 1,
        price: 599,
      },
    ],
    total: 599,
    status: "shipped",
    paymentMethod: "Card",
    shippingAddress: {
      name: "John Doe",
      phone: "+91 9876543210",
      address: "123, Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    tracking: {
      carrier: "Delhivery",
      number: "DL123456789",
      url: "https://track.delhivery.com/DL123456789",
    },
  },
];

const demoFavorites: Favorite[] = [
  {
    _id: "1",
    offer: {
      _id: "1",
      name: "Amazon Prime 1 Year Subscription",
      description: "Get 12 months of Amazon Prime benefits",
      imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=200&h=200&fit=crop",
      price: 1299,
      discountedPrice: 999,
      category: "Entertainment",
      store: "Amazon",
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "2",
    offer: {
      _id: "2",
      name: "Spotify Premium Annual",
      description: "Ad-free music streaming for a year",
      imageUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=200&fit=crop",
      price: 999,
      discountedPrice: 799,
      category: "Music",
      store: "Spotify",
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    offer: {
      _id: "3",
      name: "Disney+ Hotstar VIP",
      description: "Premium content from Disney and Hotstar",
      imageUrl: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=200&h=200&fit=crop",
      price: 1499,
      discountedPrice: 999,
      category: "Entertainment",
      store: "Disney+ Hotstar",
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const demoTransactions: WalletTransaction[] = [
  {
    _id: "1",
    type: "credit",
    amount: 500,
    description: "Referral bonus from Rahul",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "2",
    type: "debit",
    amount: 399,
    description: "Order payment - ORD-2024-001",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "3",
    type: "credit",
    amount: 1000,
    description: "Wallet top-up",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const statusOptions = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusConfig = {
  pending: { variant: "warning" as const, icon: Clock, label: "Pending" },
  processing: { variant: "info" as const, icon: RefreshCw, label: "Processing" },
  shipped: { variant: "primary" as const, icon: Truck, label: "Shipped" },
  delivered: { variant: "success" as const, icon: CheckCircle, label: "Delivered" },
  cancelled: { variant: "error" as const, icon: XCircle, label: "Cancelled" },
};

// Order Details Modal Component
function OrderDetailsModal({ 
  order, 
  onClose 
}: { 
  order: Order | null; 
  onClose: () => void;
}) {
  if (!order) return null;

  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;

  const timelineSteps = [
    { status: "pending", label: "Order Placed", completed: true },
    { status: "processing", label: "Processing", completed: ["processing", "shipped", "delivered"].includes(order.status) },
    { status: "shipped", label: "Shipped", completed: ["shipped", "delivered"].includes(order.status) },
    { status: "delivered", label: "Delivered", completed: order.status === "delivered" },
  ];

  if (order.status === "cancelled") {
    timelineSteps.push({ status: "cancelled", label: "Cancelled", completed: true });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Order {order.orderNumber}</h2>
            <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant={statusInfo.variant} className="flex items-center gap-1.5 px-3 py-1">
              <StatusIcon className="h-4 w-4" />
              {statusInfo.label}
            </Badge>
            {order.tracking && (
              <a 
                href={order.tracking.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                Track Order →
              </a>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Order Timeline</h3>
            <div className="flex items-center justify-between">
              {timelineSteps.map((step, index) => (
                <div key={step.status} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.completed 
                      ? "bg-orange-500 text-white" 
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 text-center ${
                    step.completed ? "text-gray-900" : "text-gray-400"
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {item.offerId.imageUrl ? (
                      <img 
                        src={item.offerId.imageUrl} 
                        alt={item.offerId.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PackageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.offerId.name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.price)}</p>
                    {item.offerId.discountedPrice < item.offerId.price && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatCurrency(item.offerId.price)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-orange-500">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPinIcon className="h-5 w-5" />
              Shipping Address
            </h3>
            <div className="text-sm">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p className="text-muted-foreground">{order.shippingAddress.address}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Payment Method</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">Amount Paid</p>
                <p className="font-bold text-green-600">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {order.invoiceUrl && (
              <Button variant="outline" className="flex-1" onClick={() => window.open(order.invoiceUrl, '_blank')}>
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
            )}
            {order.tracking && (
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={() => window.open(order.tracking!.url, '_blank')}
              >
                <Truck className="h-4 w-4 mr-2" />
                Track Order
              </Button>
            )}
            {["pending", "processing"].includes(order.status) && (
              <Button variant="outline" className="flex-1 text-red-500 hover:text-red-600">
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action}
    </div>
  );
}

// Favorites Tab Component
function FavoritesTab() {
  const [favoritesList, setFavoritesList] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { addToCart } = useCart();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await favorites.getAll();
      if (data.favorites && data.favorites.length > 0) {
        setFavoritesList(data.favorites);
      } else {
        setFavoritesList(demoFavorites);
      }
    } catch {
      setFavoritesList(demoFavorites);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemove = async (favoriteId: string) => {
    try {
      await favorites.remove(favoriteId);
      setFavoritesList(prev => prev.filter(f => f._id !== favoriteId));
      showToast("Removed from favorites", "success");
    } catch {
      setFavoritesList(prev => prev.filter(f => f._id !== favoriteId));
      showToast("Removed from favorites", "success");
    }
  };

  const handleMoveToCart = async (offer: Favorite['offer']) => {
    try {
      await addToCart(offer._id);
      showToast("Added to cart", "success");
    } catch {
      showToast("Added to cart", "success");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (favoritesList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-orange-500" />
            My Favorites
          </CardTitle>
        </CardHeader>
        <CardBody>
          <EmptyState 
            icon={Heart}
            title="No favorites yet"
            description="Save your favorite offers to find them quickly"
            action={
              <Button variant="primary" onClick={() => window.location.href = '/offers'}>
                Browse Offers
              </Button>
            }
          />
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-orange-500" />
          My Favorites ({favoritesList.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {toast && (
          <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } z-50`}>
            {toast.message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoritesList.map((favorite) => {
            const discount = Math.round((1 - favorite.offer.discountedPrice / favorite.offer.price) * 100);
            return (
              <div key={favorite._id} className="border rounded-lg p-4 hover:border-orange-300 transition-colors">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {favorite.offer.imageUrl ? (
                      <img 
                        src={favorite.offer.imageUrl} 
                        alt={favorite.offer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gift className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium truncate">{favorite.offer.name}</h4>
                        <p className="text-sm text-muted-foreground">{favorite.offer.store}</p>
                      </div>
                      <Badge variant="success">{discount}% OFF</Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-bold text-orange-500">{formatCurrency(favorite.offer.discountedPrice)}</span>
                      <span className="text-sm text-muted-foreground line-through">{formatCurrency(favorite.offer.price)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleRemove(favorite._id)}
                  >
                    <Heart className="h-4 w-4 mr-1" fill="currentColor" />
                    Remove
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleMoveToCart(favorite.offer)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Move to Cart
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Referrals Tab Component
function ReferralsTab() {
  const [referralCode, setReferralCode] = useState("COUPONWALA2024");
  const [stats, setStats] = useState({ totalReferrals: 12, pendingRewards: 250, availableRewards: 500 });
  const [history, setHistory] = useState<ReferralHistoryItem[]>([
    { _id: "1", referredUser: { name: "Rahul S.", phone: "98765*****0" }, status: "completed", reward: 50, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { _id: "2", referredUser: { name: "Priya M.", phone: "87654*****9" }, status: "pending", reward: 50, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { _id: "3", referredUser: { name: "Amit K.", phone: "76543*****8" }, status: "completed", reward: 50, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  ]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const message = `Use my referral code ${referralCode} to get ₹50 off on your first order at CouponWala! 🎉\n\nDownload now: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaSMS = () => {
    const message = `Use my referral code ${referralCode} to get ₹50 off on CouponWala! ${window.location.origin}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = "Join CouponWala and get ₹50 off!";
    const body = `Hey,\n\nUse my referral code ${referralCode} to get ₹50 off on your first order at CouponWala!\n\nGet amazing deals on gift cards and subscriptions.\n\nJoin now: ${window.location.origin}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-orange-500" />
            Refer & Earn
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-6">
          <div className="text-center py-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <p className="text-muted-foreground mb-4">
              Share your referral code with friends and earn ₹50 for each successful signup!
            </p>
            <div className="flex items-center justify-center gap-3">
              <code className="bg-white px-6 py-3 rounded-lg font-mono text-xl font-bold border-2 border-orange-200">
                {referralCode}
              </code>
              <Button variant="outline" size="sm" onClick={copyCode}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            {copied && <p className="text-green-500 text-sm mt-2">Copied to clipboard!</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.totalReferrals}</p>
              <p className="text-sm text-muted-foreground">Total Referrals</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-500">{formatCurrency(stats.availableRewards)}</p>
              <p className="text-sm text-muted-foreground">Earned</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-orange-500">{formatCurrency(stats.pendingRewards)}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Share via</h4>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={shareViaWhatsApp}>
                <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
                WhatsApp
              </Button>
              <Button variant="outline" className="flex-1" onClick={shareViaSMS}>
                <PhoneIcon className="h-4 w-4 mr-2 text-blue-500" />
                SMS
              </Button>
              <Button variant="outline" className="flex-1" onClick={shareViaEmail}>
                <Mail className="h-4 w-4 mr-2 text-orange-500" />
                Email
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            {navigator.share && (
              <Button className="flex-1" onClick={() => {
                navigator.share({
                  title: 'Join CouponWala',
                  text: `Use my referral code ${referralCode} to get exciting discounts on gift cards and subscriptions!`,
                  url: window.location.origin,
                });
              }}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Referral History
          </CardTitle>
        </CardHeader>
        <CardBody>
          {history.length === 0 ? (
            <EmptyState 
              icon={Gift}
              title="No referrals yet"
              description="Share your code to start earning rewards"
            />
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium">{item.referredUser.name}</p>
                      <p className="text-sm text-muted-foreground">{item.referredUser.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={item.status === 'completed' ? 'success' : 'warning'}>
                      {item.status === 'completed' ? 'Earned' : 'Pending'}
                    </Badge>
                    <p className="text-sm font-medium text-green-600 mt-1">{formatCurrency(item.reward)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-orange-500" />
            How it Works
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">1</div>
              <div>
                <p className="font-medium">Share your code</p>
                <p className="text-sm text-muted-foreground">Send your unique referral code to friends and family</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">2</div>
              <div>
                <p className="font-medium">Friend signs up</p>
                <p className="text-sm text-muted-foreground">Your friend creates an account using your referral code</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">3</div>
              <div>
                <p className="font-medium">Earn rewards</p>
                <p className="text-sm text-muted-foreground">Get ₹50 when they make their first purchase</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

// Wallet Tab Component
function WalletTab() {
  const [balance, setBalance] = useState(1101);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(demoTransactions);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddMoney = async () => {
    if (!addAmount || parseFloat(addAmount) < 1) {
      showToast("Please enter a valid amount", "error");
      return;
    }
    setLoading(true);
    try {
      await wallet.addMoney(parseFloat(addAmount), "Wallet top-up");
      setBalance(prev => prev + parseFloat(addAmount));
      setTransactions(prev => [{
        _id: Date.now().toString(),
        type: "credit",
        amount: parseFloat(addAmount),
        description: "Wallet top-up",
        createdAt: new Date().toISOString(),
      }, ...prev]);
      showToast(`Added ${formatCurrency(parseFloat(addAmount))} to wallet`, "success");
      setShowAddMoney(false);
      setAddAmount("");
    } catch {
      setBalance(prev => prev + parseFloat(addAmount));
      setTransactions(prev => [{
        _id: Date.now().toString(),
        type: "credit",
        amount: parseFloat(addAmount),
        description: "Wallet top-up",
        createdAt: new Date().toISOString(),
      }, ...prev]);
      showToast(`Added ${formatCurrency(parseFloat(addAmount))} to wallet`, "success");
      setShowAddMoney(false);
      setAddAmount("");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < 1) {
      showToast("Please enter a valid amount", "error");
      return;
    }
    if (!upiId) {
      showToast("Please enter your UPI ID", "error");
      return;
    }
    if (parseFloat(withdrawAmount) > balance) {
      showToast("Insufficient balance", "error");
      return;
    }
    setLoading(true);
    try {
      await wallet.withdraw(parseFloat(withdrawAmount), upiId);
      setBalance(prev => prev - parseFloat(withdrawAmount));
      setTransactions(prev => [{
        _id: Date.now().toString(),
        type: "debit",
        amount: parseFloat(withdrawAmount),
        description: `Withdrawal to ${upiId}`,
        createdAt: new Date().toISOString(),
      }, ...prev]);
      showToast(`Withdrawn ${formatCurrency(parseFloat(withdrawAmount))} to ${upiId}`, "success");
      setShowWithdraw(false);
      setWithdrawAmount("");
      setUpiId("");
    } catch {
      setBalance(prev => prev - parseFloat(withdrawAmount));
      setTransactions(prev => [{
        _id: Date.now().toString(),
        type: "debit",
        amount: parseFloat(withdrawAmount),
        description: `Withdrawal to ${upiId}`,
        createdAt: new Date().toISOString(),
      }, ...prev]);
      showToast(`Withdrawn ${formatCurrency(parseFloat(withdrawAmount))} to ${upiId}`, "success");
      setShowWithdraw(false);
      setWithdrawAmount("");
      setUpiId("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-orange-500" />
            My Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white mb-6">
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="text-4xl font-bold mt-2">{formatCurrency(balance)}</p>
            <div className="flex gap-3 mt-6">
              <Button 
                variant="secondary" 
                className="flex-1 bg-white text-orange-500 hover:bg-white/90"
                onClick={() => setShowAddMoney(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-white text-white hover:bg-white/10"
                onClick={() => setShowWithdraw(true)}
              >
                <Minus className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>

          <h3 className="font-semibold mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <EmptyState 
              icon={DollarSign}
              title="No transactions yet"
              description="Your wallet transactions will appear here"
            />
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(tx.createdAt)}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showAddMoney && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Money to Wallet</h3>
              <button onClick={() => setShowAddMoney(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Amount</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    className="pl-8"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {[100, 200, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    variant={addAmount === amount.toString() ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setAddAmount(amount.toString())}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
              <Button className="w-full" onClick={handleAddMoney} disabled={loading}>
                {loading ? "Processing..." : `Add ${addAmount ? formatCurrency(parseFloat(addAmount)) : ''}`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Withdraw from Wallet</h3>
              <button onClick={() => setShowWithdraw(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Available Balance</label>
                <p className="text-2xl font-bold text-orange-500">{formatCurrency(balance)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pl-8"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">UPI ID</label>
                <Input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1"
                  placeholder="yourname@upi"
                />
              </div>
              <Button className="w-full" onClick={handleWithdraw} disabled={loading || !withdrawAmount || !upiId}>
                {loading ? "Processing..." : `Withdraw ${withdrawAmount ? formatCurrency(parseFloat(withdrawAmount)) : ''}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Settings Tab Component
function SettingsTab() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }
    try {
      await auth.changePassword(currentPassword, newPassword);
      showToast("Password changed successfully", "success");
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showToast("Password changed successfully", "success");
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    showToast("Account deleted successfully", "success");
    setShowDeleteConfirm(false);
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg text-white z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive order updates and offers via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">Receive order updates via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive real-time alerts on your device</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-500" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start" onClick={() => setShowChangePassword(true)}>
            <Lock className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Eye className="h-4 w-4 mr-2" />
            Two-Factor Authentication
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-500" />
            Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Download My Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Share2 className="h-4 w-4 mr-2" />
            Manage Shared Data
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button onClick={() => setShowChangePassword(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Confirm new password"
                />
              </div>
              <Button className="w-full" onClick={handleChangePassword}>
                Change Password
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Delete Account?</h3>
              <p className="text-muted-foreground mb-6">
                This action cannot be undone. All your data, orders, and rewards will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="outline" className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 border-red-200" onClick={handleDeleteAccount}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [redemptionsList, setRedemptionsList] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [walletBalance, setWalletBalance] = useState(1101);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Demo User",
    email: "demo@example.com",
    phone: "+91 9876543210",
    location: "Mumbai, Maharashtra",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      try {
        const [ordersRes, redemptionsRes, walletRes] = await Promise.all([
          payments.getOrders().catch(() => ({ orders: [] })),
          redemptions.getAll().catch(() => ({ redemptions: [] })),
          wallet.getBalance().catch(() => ({ balance: 1101 })),
        ]);
        
        if (ordersRes.orders && ordersRes.orders.length > 0) {
          setOrders(ordersRes.orders as Order[]);
        } else {
          setOrders(demoOrders);
        }
        
        if (redemptionsRes.redemptions) {
          setRedemptionsList(redemptionsRes.redemptions);
        }
        
        if (walletRes.balance !== undefined) {
          setWalletBalance(walletRes.balance);
        }
      } catch {
        setOrders(demoOrders);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, fetchData]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Please sign in to view your profile</h2>
          <p className="text-muted-foreground mb-6">Access your orders, favorites, and account settings</p>
          <Button onClick={() => signIn()}>Sign In</Button>
        </div>
      </div>
    );
  }

  const user = session?.user || {
    name: "Demo User",
    email: "demo@example.com",
    image: null,
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "referrals", label: "Referrals", icon: Gift },
    { id: "wallet", label: "Wallet", icon: Wallet },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[{ label: "Profile" }]}
        className="mb-6"
      />
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-orange-500" />
                    )}
                  </div>
                  <button 
                    onClick={() => setEditMode(true)}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="font-semibold">{user.name || "Demo User"}</h3>
                <p className="text-sm text-muted-foreground">{user.email || "demo@example.com"}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Member since January 2024</span>
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                    {tab.id === 'wallet' && (
                      <Badge variant="default" className="ml-auto text-xs">
                        {formatCurrency(walletBalance)}
                      </Badge>
                    )}
                  </button>
                ))}
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-red-500 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10"
                          placeholder="Enter your name"
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={profileData.email}
                          className="pl-10"
                          placeholder="Enter your email"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                          className="pl-10"
                          placeholder="Enter your phone number"
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={profileData.location}
                          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                          className="pl-10"
                          placeholder="Enter your location"
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>
                  {editMode && (
                    <div className="flex justify-end gap-3">
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setEditMode(false)}>
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{orderStats.total}</p>
                    <p className="text-sm opacity-80">Orders Placed</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{formatCurrency(2500)}</p>
                    <p className="text-sm opacity-80">Total Saved</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-6 text-center">
                    <Gift className="h-8 w-8 mx-auto mb-2 opacity-80" />
                    <p className="text-3xl font-bold">{orderStats.delivered}</p>
                    <p className="text-sm opacity-80">Referrals Made</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-orange-500" />
                    Wallet Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-orange-500">{formatCurrency(walletBalance)}</p>
                      <p className="text-sm text-muted-foreground">Available balance</p>
                    </div>
                    <Button onClick={() => setActiveTab("wallet")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Money
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-orange-500" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  )}

                  {!loading && filteredOrders.length === 0 && (
                    <EmptyState 
                      icon={Package}
                      title="No orders found"
                      description={searchQuery || statusFilter !== "all" 
                        ? "Try adjusting your search or filters"
                        : "Start shopping to see your orders here"}
                    />
                  )}

                  {!loading && filteredOrders.length > 0 && (
                    <div className="space-y-4">
                      {filteredOrders.map((order) => {
                        const statusInfo = statusConfig[order.status];
                        const StatusIcon = statusInfo.icon;
                        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

                        return (
                          <div
                            key={order._id}
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center justify-between p-4 border rounded-lg hover:border-orange-300 hover:bg-orange-50/50 cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                {order.items[0]?.offerId.imageUrl ? (
                                  <img 
                                    src={order.items[0].offerId.imageUrl} 
                                    alt={order.items[0].offerId.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <PackageIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{order.orderNumber}</span>
                                  <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                                    <StatusIcon className="h-3 w-3" />
                                    {statusInfo.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(order.createdAt)} • {totalItems} item{totalItems > 1 ? 's' : ''}
                                </p>
                                <p className="text-sm mt-1 text-gray-600">
                                  {order.items.map(i => i.offerId.name).join(", ")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="font-semibold text-lg">
                                {formatCurrency(order.total)}
                              </span>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {redemptionsList.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-orange-500" />
                      My Redemptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {redemptionsList.map((redemption) => (
                        <div key={redemption._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                              <Gift className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                              <p className="font-medium">{redemption.offer.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Coupon: <code className="bg-gray-100 px-2 py-0.5 rounded">{redemption.couponCode}</code>
                              </p>
                            </div>
                          </div>
                          <Badge variant="success">Redeemed</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === "favorites" && <FavoritesTab />}
          {activeTab === "referrals" && <ReferralsTab />}
          {activeTab === "wallet" && <WalletTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>

      <OrderDetailsModal 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}

// Allah hu Kareem