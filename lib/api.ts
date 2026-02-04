import { User, Offer, PaginatedResponse, Favorite } from '@/types';

// API Configuration
// Note: API_URL should be the base URL without /api suffix (e.g., http://localhost:3001)
// The /api prefix is automatically added
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : 'http://localhost:3001/api';

// Types
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface LoginParams {
  phoneNumber?: string;
  email?: string;
  password: string;
}

interface RegisterParams {
  phoneNumber: string;
  password: string;
  name: string;
  referralCode?: string;
}

interface OTPParams {
  phoneNumber: string;
}

interface VerifyOTPParams {
  phoneNumber: string;
  otp: string;
}

interface LoginWithOTPParams {
  phoneNumber: string;
  otp: string;
}

interface RegisterWithOTPParams {
  phoneNumber: string;
  otp: string;
  name: string;
  email?: string;
  referralCode?: string;
}

interface SendOTPResponse {
  message: string;
  expiresIn: number;
}

interface VerifyOTPResponse {
  verified: boolean;
  userExists: boolean;
  phoneNumber: string;
}

interface OfferFilters {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface CartItem {
  offerId: string;
  quantity: number;
}

interface PaymentParams {
  amount: number;
  offerId: string;
  paymentMethodId?: string;
}

interface UserProfileUpdate {
  name?: string;
  email?: string;
  avatar?: string;
}

interface ReferralApply {
  referralCode: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface ReferralStats {
  code: string;
  totalReferrals: number;
  pendingRewards: number;
  availableRewards: number;
}

interface WalletTransaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  createdAt: string;
}

interface WalletBalance {
  balance: number;
}

interface Order {
  _id: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

// API Client Class
class ApiClient {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('userToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  setTokens(token: string | null, refreshToken: string | null) {
    this.token = token;
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('userToken', token);
      } else {
        localStorage.removeItem('userToken');
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
      }
    }
  }

  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      
      // Handle token refresh for 401 errors
      if (response.status === 401 && this.refreshToken) {
        try {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Retry the original request
            return this.retryRequest(response.url, response);
          }
        } catch {
          this.clearTokens();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
      
      throw new Error(error.message || 'An error occurred');
    }
    return response.json();
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token && data.refreshToken) {
          this.setTokens(data.token, data.refreshToken);
          return true;
        }
      }
    } catch {
      // Silent fail for refresh
    }
    return false;
  }

  private async retryRequest(url: string, originalResponse: Response): Promise<any> {
    const response = await fetch(url, {
      method: originalResponse.url.includes('POST') ? 'POST' : 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ AUTH ============

  async login(params: LoginParams): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await this.handleResponse<AuthResponse>(response);
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  async register(params: RegisterParams): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await this.handleResponse<AuthResponse>(response);
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  // ============ OTP AUTH ============

  async sendOTP(params: OTPParams): Promise<SendOTPResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return this.handleResponse<SendOTPResponse>(response);
  }

  async verifyOTP(params: VerifyOTPParams): Promise<VerifyOTPResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return this.handleResponse<VerifyOTPResponse>(response);
  }

  async loginWithOTP(params: LoginWithOTPParams): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login-with-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await this.handleResponse<AuthResponse>(response);
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  async registerWithOTP(params: RegisterWithOTPParams): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register-with-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await this.handleResponse<AuthResponse>(response);
    this.setTokens(data.accessToken, data.refreshToken);
    return data;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } finally {
      this.clearTokens();
    }
  }

  async getProfile(): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(data: UserProfileUpdate): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // ============ OFFERS ============

  async getOffers(filters?: OfferFilters): Promise<PaginatedResponse<Offer>> {
    const searchParams = new URLSearchParams();
    if (filters?.category) searchParams.set('category', filters.category);
    if (filters?.search) searchParams.set('search', filters.search);
    if (filters?.page) searchParams.set('page', filters.page.toString());
    if (filters?.limit) searchParams.set('limit', filters.limit.toString());
    if (filters?.sortBy) searchParams.set('sortBy', filters.sortBy);
    if (filters?.sortOrder) searchParams.set('sortOrder', filters.sortOrder);

    const response = await fetch(`${API_BASE_URL}/offers?${searchParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getOfferById(id: string): Promise<{ offer: Offer; relatedOffers?: Offer[] }> {
    const response = await fetch(`${API_BASE_URL}/offers/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'An error occurred');
    }
    
    return response.json();
  }

  async getFeaturedOffers(): Promise<{ offers: Offer[] }> {
    const response = await fetch(`${API_BASE_URL}/offers/featured`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getTrendingOffers(): Promise<{ offers: Offer[] }> {
    const response = await fetch(`${API_BASE_URL}/offers/trending`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async searchOffers(query: string, page = 1, limit = 20): Promise<PaginatedResponse<Offer>> {
    const response = await fetch(`${API_BASE_URL}/offers/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getDealOfDay(): Promise<{ offer: Offer }> {
    const response = await fetch(`${API_BASE_URL}/offers/deal-of-day`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getOffersByCategory(category: string, page = 1, limit = 20): Promise<PaginatedResponse<Offer>> {
    const response = await fetch(`${API_BASE_URL}/offers/category/${encodeURIComponent(category)}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ CATEGORIES ============

  async getCategories(): Promise<{ categories: Category[] }> {
    const response = await fetch(`${API_BASE_URL}/offers/categories`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getCategoryById(id: string): Promise<{ category: Category }> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ CART ============

  async getCart(): Promise<{ items: CartItem[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/users/cart`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async addToCart(offerId: string, quantity = 1): Promise<{ items: CartItem[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/users/cart/add`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ offerId, quantity }),
    });
    return this.handleResponse(response);
  }

  async updateCartItem(itemId: string, quantity: number): Promise<{ items: CartItem[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/users/cart/update`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ itemId, quantity }),
    });
    return this.handleResponse(response);
  }

  async removeFromCart(offerId: string): Promise<{ items: CartItem[]; total: number }> {
    const response = await fetch(`${API_BASE_URL}/users/cart/remove/${offerId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async clearCart(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/cart/clear`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ FAVORITES ============

  async getFavorites(): Promise<{ favorites: Favorite[] }> {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getFavoriteIds(): Promise<{ ids: string[] }> {
    const response = await fetch(`${API_BASE_URL}/favorites/ids`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async addFavorite(offerId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ offerId }),
    });
    return this.handleResponse(response);
  }

  async removeFavorite(offerId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/favorites/${offerId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async toggleFavorite(offerId: string): Promise<{ success: boolean; isFavorite: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/favorites/toggle`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ offerId }),
    });
    return this.handleResponse(response);
  }

  async isFavorite(offerId: string): Promise<{ isFavorite: boolean }> {
    const response = await fetch(`${API_BASE_URL}/favorites/check/${offerId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ PAYMENTS / CHECKOUT ============

  async createPaymentIntent(params: PaymentParams): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const response = await fetch(`${API_BASE_URL}/payments/create-payment-intent`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });
    return this.handleResponse(response);
  }

  async confirmPayment(paymentIntentId: string): Promise<{ success: boolean; order: Order }> {
    const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ paymentIntentId }),
    });
    return this.handleResponse(response);
  }

  async getPayments(): Promise<{ payments: any[] }> {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getUserCoupons(): Promise<{ coupons: any[] }> {
    const response = await fetch(`${API_BASE_URL}/payments/coupons`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getOrderHistory(): Promise<{ orders: Order[] }> {
    const response = await fetch(`${API_BASE_URL}/users/orders`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ REFERRALS ============

  async getReferralCode(): Promise<{ code: string }> {
    const response = await fetch(`${API_BASE_URL}/referrals/code`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getReferralStats(): Promise<ReferralStats> {
    const response = await fetch(`${API_BASE_URL}/referrals/stats`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getReferralHistory(): Promise<{ history: any[] }> {
    const response = await fetch(`${API_BASE_URL}/referrals/history`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async validateReferralCode(code: string): Promise<{ valid: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/referrals/validate/${code}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async applyReferralCode(params: ReferralApply): Promise<{ success: boolean; message: string; reward?: number }> {
    const response = await fetch(`${API_BASE_URL}/referrals/apply`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });
    return this.handleResponse(response);
  }

  async getReferralInvite(): Promise<{ link: string; code: string }> {
    const response = await fetch(`${API_BASE_URL}/referrals/invite`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ NOTIFICATIONS ============

  async getNotifications(): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async markAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteNotification(notificationId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async registerDeviceToken(deviceToken: string, platform: 'ios' | 'android' | 'web'): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/notifications/register-token`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ deviceToken, platform }),
    });
    return this.handleResponse(response);
  }

  // ============ REDEMPTIONS ============

  async getRedemptions(): Promise<{ redemptions: any[] }> {
    const response = await fetch(`${API_BASE_URL}/users/redemptions`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async redeemOffer(offerId: string): Promise<{ success: boolean; redemption: any; couponCode?: string }> {
    const response = await fetch(`${API_BASE_URL}/offers/${offerId}/redeem`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ RATINGS ============

  async submitRating(offerId: string, rating: number, review?: string): Promise<{ success: boolean; rating: any }> {
    const response = await fetch(`${API_BASE_URL}/offers/${offerId}/ratings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ rating, review }),
    });
    return this.handleResponse(response);
  }

  async getOfferRatings(offerId: string, page = 1, limit = 10): Promise<{ ratings: any[]; pagination: any }> {
    const response = await fetch(`${API_BASE_URL}/offers/${offerId}/ratings?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getRatingSummary(offerId: string): Promise<{ summary: any; averageRating: number }> {
    const response = await fetch(`${API_BASE_URL}/offers/${offerId}/ratings/summary`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // ============ PASSWORD RESET ============

  async forgotPassword(phoneNumber: string): Promise<{ message: string; resetCode?: string; expiresIn?: number }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    });
    return this.handleResponse(response);
  }

  async resetPassword(phoneNumber: string, code: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, code, newPassword }),
    });
    return this.handleResponse(response);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return this.handleResponse(response);
  }

  // ============ WALLET ============

  async getWalletBalance(): Promise<WalletBalance> {
    const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getWalletTransactions(): Promise<{ transactions: WalletTransaction[] }> {
    const response = await fetch(`${API_BASE_URL}/wallet/transactions`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async addWalletMoney(amount: number, description?: string): Promise<{ success: boolean; balance: number; transaction: WalletTransaction }> {
    const response = await fetch(`${API_BASE_URL}/wallet/add`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, description }),
    });
    return this.handleResponse(response);
  }

  async withdrawFromWallet(amount: number, upiId: string): Promise<{ success: boolean; balance: number; transaction: WalletTransaction }> {
    const response = await fetch(`${API_BASE_URL}/wallet/withdraw`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount, upiId }),
    });
    return this.handleResponse(response);
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export helper functions for common operations
export const auth = {
  login: (phoneNumber: string, password: string) => api.login({ phoneNumber, password }),
  register: (phoneNumber: string, password: string, name: string, referralCode?: string) => 
    api.register({ phoneNumber, password, name, referralCode }),
  logout: () => api.logout(),
  getProfile: () => api.getProfile(),
  updateProfile: (data: UserProfileUpdate) => api.updateProfile(data),
  forgotPassword: (phoneNumber: string) => api.forgotPassword(phoneNumber),
  resetPassword: (phoneNumber: string, code: string, newPassword: string) => 
    api.resetPassword(phoneNumber, code, newPassword),
  changePassword: (currentPassword: string, newPassword: string) => 
    api.changePassword(currentPassword, newPassword),
  // OTP functions
  sendOTP: (phoneNumber: string) => api.sendOTP({ phoneNumber }),
  verifyOTP: (phoneNumber: string, otp: string) => api.verifyOTP({ phoneNumber, otp }),
  loginWithOTP: (phoneNumber: string, otp: string) => api.loginWithOTP({ phoneNumber, otp }),
  registerWithOTP: (phoneNumber: string, otp: string, name: string, email?: string, referralCode?: string) => 
    api.registerWithOTP({ phoneNumber, otp, name, email, referralCode }),
};

export const offers = {
  getAll: (filters?: OfferFilters) => api.getOffers(filters),
  getById: (id: string) => api.getOfferById(id),
  getFeatured: () => api.getFeaturedOffers(),
  getTrending: () => api.getTrendingOffers(),
  search: (query: string, page?: number, limit?: number) => api.searchOffers(query, page, limit),
  getByCategory: (category: string, page?: number, limit?: number) => 
    api.getOffersByCategory(category, page, limit),
  getDealOfDay: () => api.getDealOfDay(),
  redeem: (offerId: string) => api.redeemOffer(offerId),
  rate: (offerId: string, rating: number, review?: string) => 
    api.submitRating(offerId, rating, review),
  getRatings: (offerId: string, page?: number, limit?: number) => 
    api.getOfferRatings(offerId, page, limit),
  getRatingSummary: (offerId: string) => api.getRatingSummary(offerId),
};

export const categories = {
  getAll: () => api.getCategories(),
  getById: (id: string) => api.getCategoryById(id),
};

export const cart = {
  get: () => api.getCart(),
  add: (offerId: string, quantity?: number) => api.addToCart(offerId, quantity),
  update: (itemId: string, quantity: number) => api.updateCartItem(itemId, quantity),
  remove: (offerId: string) => api.removeFromCart(offerId),
  clear: () => api.clearCart(),
};

export const payments = {
  createIntent: (amount: number, offerId: string, paymentMethodId?: string) => 
    api.createPaymentIntent({ amount, offerId, paymentMethodId }),
  confirm: (paymentIntentId: string) => api.confirmPayment(paymentIntentId),
  getHistory: () => api.getPayments(),
  getCoupons: () => api.getUserCoupons(),
  getOrders: () => api.getOrderHistory(),
};

export const favorites = {
  getAll: () => api.getFavorites(),
  getIds: () => api.getFavoriteIds(),
  add: (offerId: string) => api.addFavorite(offerId),
  remove: (offerId: string) => api.removeFavorite(offerId),
  toggle: (offerId: string) => api.toggleFavorite(offerId),
  check: (offerId: string) => api.isFavorite(offerId),
};

export const referrals = {
  getCode: () => api.getReferralCode(),
  getStats: () => api.getReferralStats(),
  getHistory: () => api.getReferralHistory(),
  validate: (code: string) => api.validateReferralCode(code),
  apply: (code: string) => api.applyReferralCode({ referralCode: code }),
  getInvite: () => api.getReferralInvite(),
};

export const notifications = {
  getAll: () => api.getNotifications(),
  markAsRead: (id: string) => api.markAsRead(id),
  markAllAsRead: () => api.markAllAsRead(),
  delete: (id: string) => api.deleteNotification(id),
  registerToken: (token: string, platform: 'ios' | 'android' | 'web') => 
    api.registerDeviceToken(token, platform),
};

export const redemptions = {
  getAll: () => api.getRedemptions(),
};

export const wallet = {
  getBalance: () => api.getWalletBalance(),
  getTransactions: () => api.getWalletTransactions(),
  addMoney: (amount: number, description?: string) => api.addWalletMoney(amount, description),
  withdraw: (amount: number, upiId: string) => api.withdrawFromWallet(amount, upiId),
};

export const authApi = api;

export default api;
