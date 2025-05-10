import apiClient from "./api";
import { Notification, NotificationUpdateRequest } from "../types";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

// Notification service
const notificationService = {
  // Get all notifications for current user
  getNotifications: async (page = 1, limit = 10) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Notification>>
    >("/notifications", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      "/notifications/unread-count"
    );
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    const response = await apiClient.put<ApiResponse<Notification>>(
      `/notifications/${id}`,
      { isRead: true } as NotificationUpdateRequest
    );
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await apiClient.put<ApiResponse<{ success: boolean }>>(
      "/notifications/mark-all-read"
    );
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/notifications/${id}`
    );
    return response.data;
  },

  // Delete all notifications
  deleteAllNotifications: async () => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      "/notifications"
    );
    return response.data;
  },
};

export default notificationService;
