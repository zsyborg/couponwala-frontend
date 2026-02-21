// API service for authentication

// Use relative URLs to leverage Next.js rewrites (avoids CORS issues)
const API_BASE_URL = '';

interface User {
  id: string;
  phoneNumber: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Auth API methods
export const auth = {
  async getProfile() {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to get profile");
    }
    
    return response.json();
  },

  async login(phoneNumber: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    
    return response.json();
  },

  async loginWithOTP(phoneNumber: string, otp: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login-with-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    
    return response.json();
  },

  async register(phoneNumber: string, password: string, name: string, referralCode?: string): Promise<AuthResponse> {
    const body: any = { phoneNumber, password, name };
    if (referralCode) {
      body.referralCode = referralCode;
    }
    
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }
    
    return response.json();
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
    });
    
    if (!response.ok) {
      throw new Error("Logout failed");
    }
    
    return response.json();
  },

  async updateProfile(data: { name?: string; email?: string; avatar?: string }) {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/admin/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Update failed");
    }
    
    return response.json();
  },

  async sendOTP(phoneNumber: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send OTP");
    }
    
    return response.json();
  },

  async verifyOTP(phoneNumber: string, otp: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Verification failed");
    }
    
    return response.json();
  },
};

// RTK Query API slice for auth
export const authApi = {
  async login(credentials: { phoneNumber: string; password: string }): Promise<LoginResponse> {
    return auth.login(credentials.phoneNumber, credentials.password);
  },

  async register(userData: { phoneNumber: string; password: string; name: string; referralCode?: string }): Promise<AuthResponse> {
    return auth.register(userData.phoneNumber, userData.password, userData.name, userData.referralCode);
  },
};

// Cart API methods
interface CartItemResponse {
  offerId: string;
  quantity: number;
  offer?: {
    title?: string;
    image?: string;
    store?: { name?: string };
    price?: number;
    originalPrice?: number;
  };
}

interface CartResponse {
  items: CartItemResponse[];
}

export const cart = {
  async get(): Promise<CartResponse> {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get cart");
    }

    return response.json();
  },

  async add(offerId: string, quantity: number): Promise<CartResponse> {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/cart/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ offerId, quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add item to cart");
    }

    return response.json();
  },

  async update(offerId: string, quantity: number): Promise<CartResponse> {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/cart/items/${offerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update cart item");
    }

    return response.json();
  },

  async remove(offerId: string): Promise<CartResponse> {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/cart/items/${offerId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove cart item");
    }

    return response.json();
  },

  async clear(): Promise<{ success: boolean }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to clear cart");
    }

    return response.json();
  },
};

// Notifications API methods
interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

export const notifications = {
  async getAll(): Promise<NotificationResponse> {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return response.json();
  },

  async markAsRead(id: string): Promise<{ success: boolean }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }

    return response.json();
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }

    return response.json();
  },

  async delete(id: string): Promise<{ success: boolean }> {
    const token = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
    const response = await fetch(`${API_BASE_URL}/api/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }

    return response.json();
  },
};
