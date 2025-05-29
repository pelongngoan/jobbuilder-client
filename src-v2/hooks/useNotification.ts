import notificationService from "../services/notificationService";
import { Notification } from "../types/notification.types";
const useNotification = () => {
  const getNotifications = async () => {
    const response = await notificationService.getNotifications();
    return response;
  };

  const getNotificationById = async (id: string) => {
    const response = await notificationService.getNotificationById(id);
    return response;
  };

  const createNotification = async (notification: Notification) => {
    const response = await notificationService.createNotification(notification);
    return response;
  };

  return { getNotifications, getNotificationById, createNotification };
};

export default useNotification;
