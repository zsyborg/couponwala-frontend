"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User } from "@/types";
import { auth } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  loginWithOTP: (phoneNumber: string, otp: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<boolean>;
  clearError: () => void;
  error: string | null;
}

interface RegisterData {
  phoneNumber: string;
  password: string;
  name: string;
  referralCode?: string;
}

interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("userToken") : null;
      
      if (storedToken) {
        setToken(storedToken);
        try {
          const { user: userData } = await auth.getProfile();
          setUser(userData);
        } catch {
          // Token invalid, clear storage
          localStorage.removeItem("userToken");
          localStorage.removeItem("refreshToken");
          setToken(null);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await auth.login(phoneNumber, password);
      setUser(response.user);
      setToken(response.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithOTP = useCallback(async (phoneNumber: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await auth.loginWithOTP(phoneNumber, otp);
      setUser(response.user);
      setToken(response.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await auth.register(data.phoneNumber, data.password, data.name, data.referralCode);
      setUser(response.user);
      setToken(response.token);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await auth.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      setToken(null);
      setError(null);
      localStorage.removeItem("userToken");
      localStorage.removeItem("refreshToken");
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: updatedUser } = await auth.updateProfile(data);
      setUser(updatedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendOTP = useCallback(async (phoneNumber: string) => {
    setError(null);
    try {
      await auth.sendOTP(phoneNumber);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      setError(message);
      throw err;
    }
  }, []);

  const verifyOTP = useCallback(async (phoneNumber: string, otp: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await auth.verifyOTP(phoneNumber, otp);
      return response.verified;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setError(message);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    token,
    login,
    loginWithOTP,
    register,
    logout,
    updateProfile,
    sendOTP,
    verifyOTP,
    clearError,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
