import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import notificationService from "../services/notificationService";
import { Notification } from "../types/notification.types";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  // Fetch notifications
  const fetchNotifications = async (
    page = 1,
    limit = 10,
    unreadOnly = false
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications(
        page,
        limit,
        unreadOnly
      );

      if (response.success) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch notifications";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read";
      setError(errorMessage);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read";
      setError(errorMessage);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );

      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find((n) => n._id === id);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete notification";
      setError(errorMessage);
    }
  };

  // Socket.io event handlers for real-time notifications
  useEffect(() => {
    if (!socket) return;

    // Handle new notifications
    const handleNewNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // You can add toast notifications here
      console.log("New notification received:", notification);
    };

    // Handle application updates
    const handleApplicationUpdate = (application: unknown) => {
      console.log("Application update received:", application);
      // You can handle application-specific updates here
    };

    // Listen for real-time events
    socket.on("new_notification", handleNewNotification);
    socket.on("application_update", handleApplicationUpdate);

    // Cleanup event listeners
    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("application_update", handleApplicationUpdate);
    };
  }, [socket]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: () => fetchNotifications(),
  };
};
