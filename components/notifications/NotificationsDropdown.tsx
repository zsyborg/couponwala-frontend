"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Package, Tag, Wallet, Users, Settings, Clock, ChevronRight, Check, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  order: <Package className="h-4 w-4 text-orange-500" />,
  offer: <Tag className="h-4 w-4 text-green-500" />,
  wallet: <Wallet className="h-4 w-4 text-blue-500" />,
  referral: <Users className="h-4 w-4 text-purple-500" />,
  system: <Settings className="h-4 w-4 text-gray-500" />,
};

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { recentNotifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    if (notification.actionUrl) {
      setIsOpen(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-orange-100 hover:text-black transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-white" />
        {unreadCount > 0 && (
          <Badge
            variant="error"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-orange-50 border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="error" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`relative p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-orange-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-full flex-shrink-0 ${
                          !notification.isRead ? "bg-white" : "bg-gray-100"
                        }`}
                      >
                        {NOTIFICATION_ICONS[notification.type] || (
                          <Bell className="h-4 w-4 text-gray-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {!notification.isRead && (
                                <span className="h-2 w-2 bg-orange-500 rounded-full flex-shrink-0" />
                              )}
                              <p
                                className={`text-sm font-medium truncate ${
                                  !notification.isRead ? "text-gray-900" : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="flex items-center gap-1 text-xs text-gray-400">
                                <Clock className="h-3 w-3" />
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {!notification.isRead && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification._id);
                                }}
                                className="p-1 rounded hover:bg-orange-100 text-orange-500"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              onClick={(e) => handleDelete(e, notification._id)}
                              className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Action Link */}
                        {notification.actionUrl && (
                          <Link
                            href={notification.actionUrl}
                            className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-orange-600 hover:text-orange-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {notification.actionText || "View Details"}
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  We'll notify you when something arrives
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700"
            >
              View All Notifications
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
