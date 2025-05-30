import { Notification } from "../types/notification.types";
import apiClient from "./api";

const notificationService = {
  getNotifications: async (page = 1, limit = 10, unreadOnly = false) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      unreadOnly: unreadOnly.toString(),
    });

    const response = await apiClient.get(`/notifications?${params}`);
    return response.data;
  },

  getNotificationById: async (id: string) => {
    const response = await apiClient.get(`/notifications/${id}`);
    return response.data;
  },

  createNotification: async (notification: Notification) => {
    const response = await apiClient.post("/notifications", notification);
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put("/notifications/mark-all-read");
    return response.data;
  },

  deleteNotification: async (id: string) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;
