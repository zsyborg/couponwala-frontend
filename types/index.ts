// User Types
export interface User {
  id: string;
  phoneNumber: string;
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

// API Error Types
export interface ApiError {
  message: string;
  statusCode: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface AddressFormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}
