// User Types
export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface LoginParams {
  phoneNumber: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  phoneNumber: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Offer Types
export interface Offer {
  id: string;
  serviceName: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  category: string;
  store: string;
  couponCode: string;
  imageUrl?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

export interface OfferFilters {
  category?: string;
  store?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'discountedPrice' | 'discountPercentage' | 'createdAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Cart Types
export interface CartItem {
  id: string;
  offer: Offer;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  savings: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: "pending" | "completed" | "cancelled";
  total: number;
  createdAt: string;
}

// Category Type
export interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

// API Error Types
export interface ApiError {
  message: string;
  statusCode: number;
}

// Address Form Data
export interface AddressFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

// Notification Types
export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

// Favorite Type
export interface Favorite {
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
