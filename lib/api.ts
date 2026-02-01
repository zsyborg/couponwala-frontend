import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
  },
  offers: {
    list: "/offers",
    featured: "/offers/featured",
    byId: (id: string) => `/offers/${id}`,
    byCategory: (category: string) => `/offers/category/${category}`,
    byStore: (store: string) => `/offers/store/${store}`,
    redeem: (id: string) => `/offers/${id}/redeem`,
  },
  payments: {
    createIntent: "/payments/create-payment-intent",
    confirm: "/payments/confirm",
    history: "/payments",
    methods: "/payments/payment-methods",
  },
};

// Auth API functions
export const authApi = {
  login: (data: { phoneNumber: string; password: string }) =>
    api.post(endpoints.auth.login, data),
  register: (data: { name: string; phoneNumber: string; password: string }) =>
    api.post(endpoints.auth.register, data),
  getProfile: () => api.get(endpoints.auth.profile),
  logout: () => api.post(endpoints.auth.logout),
};

// Offers API functions
export const offersApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get(endpoints.offers.list, { params }),
  getFeatured: () => api.get(endpoints.offers.featured),
  getById: (id: string) => api.get(endpoints.offers.byId(id)),
  getByCategory: (category: string) =>
    api.get(endpoints.offers.byCategory(category)),
  getByStore: (store: string) => api.get(endpoints.offers.byStore(store)),
  redeem: (id: string) => api.post(endpoints.offers.redeem(id)),
};
