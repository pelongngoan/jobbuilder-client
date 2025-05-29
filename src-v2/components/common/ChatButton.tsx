import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface ChatButtonProps {
  variant?: "light" | "dark";
  unreadCount?: number;
}

const ChatButton: React.FC<ChatButtonProps> = ({
  variant = "light",
  unreadCount = 0,
}) => {
  const { t } = useTranslation();

  const iconColor =
    variant === "light"
      ? "text-gray-600 hover:text-blue-600"
      : "text-gray-200 hover:text-white";

  return (
    <Link
      to="/user/chat"
      className={`relative p-2 rounded-md ${iconColor} focus:outline-none transition-colors`}
      title={t("navigation.messages")}
    >
      <svg
        className="h-6 w-6"
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
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default ChatButton;
