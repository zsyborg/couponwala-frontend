"use client";

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { User } from "@/types";

interface RegisterData {
  phoneNumber: string;
  password: string;
  name: string;
  email?: string;
  referralCode?: string;
  otp?: string;
}

interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  loginWithOTP: (phoneNumber: string, otp: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  registerWithOTP: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (phoneNumber: string, otp: string) => Promise<boolean>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
