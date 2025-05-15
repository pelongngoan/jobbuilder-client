import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  setNotificationLoading,
  setNotificationError,
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  setUnreadCount,
  resetNotifications,
} from "../redux/slices/notificationSlice";
import { notificationService } from "../services";
import { Notification } from "../types";

/**
 * Hook for managing notification-related actions
 */
const useNotification = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading, error } = useAppSelector(
    (state) => state.notification
  );

  // API loading states
  const getNotificationsApi = useApiCall("getNotifications");
  const getUnreadCountApi = useApiCall("getUnreadCount");
  const markAsReadApi = useApiCall("markAsRead");
  const markAllAsReadApi = useApiCall("markAllAsRead");
  const deleteNotificationApi = useApiCall("deleteNotification");
  const deleteAllNotificationsApi = useApiCall("deleteAllNotifications");

  // Fetch all notifications
  const fetchNotifications = useCallback(
    async (page = 1, limit = 10) => {
      dispatch(setNotificationLoading(true));
      const result = await getNotificationsApi.execute(
        () => notificationService.getNotifications(page, limit),
        (data) => {
          if (data.data && data.data.items) {
            dispatch(setNotifications(data.data.items));
          }
          dispatch(setNotificationLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setNotificationError(result.error || "Failed to fetch notifications")
        );
        dispatch(setNotificationLoading(false));
      }
      return result;
    },
    [dispatch, getNotificationsApi]
  );

  // Fetch unread notifications count
  const fetchUnreadCount = useCallback(async () => {
    dispatch(setNotificationLoading(true));
    const result = await getUnreadCountApi.execute(
      () => notificationService.getUnreadCount(),
      (data) => {
        if (data.data && typeof data.data.count === "number") {
          dispatch(setUnreadCount(data.data.count));
        }
        dispatch(setNotificationLoading(false));
      }
    );
    if (result && !result.success) {
      dispatch(
        setNotificationError(result.error || "Failed to fetch unread count")
      );
      dispatch(setNotificationLoading(false));
    }
    return result;
  }, [dispatch, getUnreadCountApi]);

  // Mark notification as read
  const markNotificationAsRead = useCallback(
    async (notificationId: string) => {
      dispatch(setNotificationLoading(true));
      const result = await markAsReadApi.execute(
        () => notificationService.markAsRead(notificationId),
        (data) => {
          if (data.data) {
            dispatch(markAsRead(notificationId));
          }
          dispatch(setNotificationLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setNotificationError(
            result.error || "Failed to mark notification as read"
          )
        );
        dispatch(setNotificationLoading(false));
      }
      return result;
    },
    [dispatch, markAsReadApi]
  );

  // Mark all notifications as read
  const markAllNotificationsAsRead = useCallback(async () => {
    dispatch(setNotificationLoading(true));
    const result = await markAllAsReadApi.execute(
      () => notificationService.markAllAsRead(),
      () => {
        dispatch(markAllAsRead());
        dispatch(setNotificationLoading(false));
      }
    );
    if (result && !result.success) {
      dispatch(
        setNotificationError(
          result.error || "Failed to mark all notifications as read"
        )
      );
      dispatch(setNotificationLoading(false));
    }
    return result;
  }, [dispatch, markAllAsReadApi]);

  // Delete a notification
  const removeNotification = useCallback(
    async (notificationId: string) => {
      dispatch(setNotificationLoading(true));
      const result = await deleteNotificationApi.execute(
        () => notificationService.deleteNotification(notificationId),
        () => {
          dispatch(deleteNotification(notificationId));
          dispatch(setNotificationLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setNotificationError(result.error || "Failed to delete notification")
        );
        dispatch(setNotificationLoading(false));
      }
      return result;
    },
    [dispatch, deleteNotificationApi]
  );

  // Delete all notifications
  const removeAllNotifications = useCallback(async () => {
    dispatch(setNotificationLoading(true));
    const result = await deleteAllNotificationsApi.execute(
      () => notificationService.deleteAllNotifications(),
      () => {
        dispatch(resetNotifications());
        dispatch(setNotificationLoading(false));
      }
    );
    if (result && !result.success) {
      dispatch(
        setNotificationError(
          result.error || "Failed to delete all notifications"
        )
      );
      dispatch(setNotificationLoading(false));
    }
    return result;
  }, [dispatch, deleteAllNotificationsApi]);

  // Add a new notification (typically from websocket)
  const addNewNotification = useCallback(
    (notification: Notification) => {
      dispatch(addNotification(notification));
    },
    [dispatch]
  );

  // Clear notification state
  const clearNotifications = useCallback(() => {
    dispatch(resetNotifications());
  }, [dispatch]);

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,

    // Methods
    fetchNotifications,
    fetchUnreadCount,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification: removeNotification,
    deleteAllNotifications: removeAllNotifications,
    addNotification: addNewNotification,
    clearNotifications,
  };
};

export default useNotification;
