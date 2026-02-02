"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { notifications } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";

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

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  recentNotifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export { NotificationContext };

interface NotificationProviderProps {
  children: ReactNode;
}

const POLL_INTERVAL = 30000; // 30 seconds

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notificationsState, setNotificationsState] = useState<Notification[]>([]);
  const [unreadCountState, setUnreadCountState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const { addToast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await notifications.getAll();
      if (response.notifications) {
        const typedNotifications = response.notifications as unknown as Notification[];
        setNotificationsState(typedNotifications);
        setUnreadCountState(response.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notifications.markAsRead(id);
      setNotificationsState((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCountState((prev) => Math.max(0, prev - 1));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to mark as read";
      addToast("error", message);
    }
  }, [addToast]);

  const markAllAsRead = useCallback(async () => {
    try {
      await notifications.markAllAsRead();
      setNotificationsState((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCountState(0);
      addToast("success", "All notifications marked as read");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to mark all as read";
      addToast("error", message);
    }
  }, [addToast]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notifications.delete(id);
      const notification = notificationsState.find((n) => n._id === id);
      setNotificationsState((prev) => prev.filter((n) => n._id !== id));
      if (notification && !notification.isRead) {
        setUnreadCountState((prev) => Math.max(0, prev - 1));
      }
      addToast("success", "Notification deleted");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete notification";
      addToast("error", message);
    }
  }, [notificationsState, addToast]);

  // Poll for new notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  const recentNotifications = notificationsState.slice(0, 5);

  const value: NotificationContextType = {
    notifications: notificationsState,
    unreadCount: unreadCountState,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    recentNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
