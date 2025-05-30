import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card } from "../../components/common";
import { useNotifications } from "../../hooks/useNotifications";

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<
    | "all"
    | "unread"
    | "job_application"
    | "application_status"
    | "application_assigned"
    | "interview_scheduled"
    | "chat_message"
  >("all");

  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job_application":
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8zM5 20a2 2 0 002-2v-2a2 2 0 00-2-2H3a2 2 0 00-2 2v2a2 2 0 002 2h2z"
              />
            </svg>
          </div>
        );
      case "application_status":
      case "application_assigned":
        return (
          <div className="bg-green-100 p-2 rounded-full">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        );
      case "interview_scheduled":
        return (
          <div className="bg-yellow-100 p-2 rounded-full">
            <svg
              className="h-5 w-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-4 9l4-4m0 0l-4-4m4 4H3"
              />
            </svg>
          </div>
        );
      case "chat_message":
        return (
          <div className="bg-purple-100 p-2 rounded-full">
            <svg
              className="h-5 w-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    return notification.type === filter;
  });

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id);
  };

  const getFilterLabel = (filterType: string) => {
    switch (filterType) {
      case "all":
        return "All";
      case "unread":
        return "Unread";
      case "job_application":
        return "Job Applications";
      case "application_status":
        return "Application Status";
      case "application_assigned":
        return "Assignments";
      case "interview_scheduled":
        return "Interviews";
      case "chat_message":
        return "Messages";
      default:
        return "All";
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("navigation.notifications")}
            </h1>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="secondary"
                size="sm"
              >
                Mark all as read
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {notifications.length}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {unreadCount}
                </div>
                <div className="text-sm text-gray-500">Unread</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    notifications.filter((n) => n.type === "job_application")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500">Jobs</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    notifications.filter((n) => n.type === "application_status")
                      .length
                  }
                </div>
                <div className="text-sm text-gray-500">Applications</div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "unread",
              "job_application",
              "application_status",
              "application_assigned",
              "interview_scheduled",
              "chat_message",
            ].map((filterType) => (
              <button
                key={filterType}
                onClick={() =>
                  setFilter(
                    filterType as
                      | "all"
                      | "unread"
                      | "job_application"
                      | "application_status"
                      | "application_assigned"
                      | "interview_scheduled"
                      | "chat_message"
                  )
                }
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === filterType
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
              >
                {getFilterLabel(filterType)}
                {filterType === "unread" && unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="p-8">
              <div className="text-center text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 111 0z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  No notifications found
                </p>
                <p className="text-gray-500">
                  {filter === "unread"
                    ? "You're all caught up! No unread notifications."
                    : "There are no notifications matching your current filter."}
                </p>
              </div>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification._id}
                className={`p-6 transition-all duration-200 hover:shadow-md ${
                  !notification.isRead
                    ? "border-l-4 border-l-blue-500 bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type || "")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-medium ${
                            !notification.isRead
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p className="mt-1 text-gray-600 leading-relaxed">
                          {notification.content}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            {formatTimeAgo(notification.createdAt!)}
                          </p>
                          <div className="flex items-center space-x-2">
                            {notification.actionUrl && (
                              <Link
                                to={notification.actionUrl}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                onClick={() =>
                                  handleMarkAsRead(notification._id!)
                                }
                              >
                                View
                              </Link>
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={() =>
                                  handleMarkAsRead(notification._id!)
                                }
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleDeleteNotification(notification._id!)
                              }
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {!notification.isRead && (
                        <div className="ml-4 flex-shrink-0">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
