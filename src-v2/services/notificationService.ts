import { Notification } from "../types/notification.types";
import apiClient from "./api";
const notificationService = {
  getNotifications: async () => {
    const response = await apiClient.get("/notifications");

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
};

export default notificationService;
