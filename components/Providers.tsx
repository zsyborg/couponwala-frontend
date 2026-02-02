"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { RecentlyViewedProvider } from "@/contexts/RecentlyViewedContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { ToastProvider } from "@/components/ui/Toast";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <CartProvider>
              <RecentlyViewedProvider>
                {children}
              </RecentlyViewedProvider>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
