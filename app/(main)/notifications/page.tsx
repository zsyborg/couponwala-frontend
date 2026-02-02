"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Bell, Package, Tag, Wallet, Users, Settings, Trash2, Check, CheckCheck, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/hooks/useAuth";

type TabType = "all" | "unread" | "order" | "offer" | "system";

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  order: <Package className="h-5 w-5 text-orange-500" />,
  offer: <Tag className="h-5 w-5 text-green-500" />,
  wallet: <Wallet className="h-5 w-5 text-blue-500" />,
  referral: <Users className="h-5 w-5 text-purple-500" />,
  system: <Settings className="h-5 w-5 text-gray-500" />,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  order: "bg-orange-50 border-orange-200",
  offer: "bg-green-50 border-green-200",
  wallet: "bg-blue-50 border-blue-200",
  referral: "bg-purple-50 border-purple-200",
  system: "bg-gray-50 border-gray-200",
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    await onDelete(notification._id);
    setIsDeleting(false);
  };

  return (
    <Card
      className={`p-4 transition-all duration-200 hover:shadow-md ${
        !notification.isRead ? NOTIFICATION_COLORS[notification.type] || "bg-orange-50" : "bg-white"
      } ${!notification.isRead ? "border-l-4 border-l-orange-500" : ""}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-2 rounded-full ${!notification.isRead ? "bg-white" : "bg-gray-100"}`}>
          {NOTIFICATION_ICONS[notification.type] || <Bell className="h-5 w-5 text-gray-500" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {!notification.isRead && (
                  <span className="h-2 w-2 bg-orange-500 rounded-full flex-shrink-0" />
                )}
                <h3 className={`font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                  {notification.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{notification.message}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(notification.createdAt)}
                </span>
                <Badge
                  variant={
                    notification.type === "order"
                      ? "warning"
                      : notification.type === "offer"
                      ? "success"
                      : notification.type === "wallet"
                      ? "info"
                      : notification.type === "referral"
                      ? "primary"
                      : "default"
                  }
                  className="text-xs"
                >
                  {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!notification.isRead && (
                <button
                  onClick={() => onMarkAsRead(notification._id)}
                  className="p-1.5 rounded-lg hover:bg-orange-100 text-orange-600 transition-colors"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                title="Delete notification"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Button */}
          {notification.actionUrl && (
            <Link
              href={notification.actionUrl}
              className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              {notification.actionText || "View Details"}
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ activeTab }: { activeTab: TabType }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Bell className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
      <p className="text-gray-500 max-w-sm">
        {activeTab === "unread"
          ? "You're all caught up! No unread notifications."
          : activeTab === "order"
          ? "You don't have any order notifications yet."
          : activeTab === "offer"
          ? "No offers or deals notifications at the moment."
          : activeTab === "system"
          ? "No system notifications."
          : "You don't have any notifications yet."}
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-4 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case "unread":
        return localNotifications.filter((n) => !n.isRead);
      case "order":
        return localNotifications.filter((n) => n.type === "order");
      case "offer":
        return localNotifications.filter((n) => n.type === "offer");
      case "system":
        return localNotifications.filter((n) => n.type === "system");
      default:
        return localNotifications;
    }
  }, [localNotifications, activeTab]);

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "order", label: "Orders" },
    { id: "offer", label: "Offers" },
    { id: "system", label: "System" },
  ];

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center py-16">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-500 mb-6">Please login to view your notifications</p>
            <Link href="/login">
              <Button variant="primary">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-orange-500 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
              <p className="text-orange-100">Stay updated with your orders, offers, and more</p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id ? "bg-white text-orange-600" : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyState activeTab={activeTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
