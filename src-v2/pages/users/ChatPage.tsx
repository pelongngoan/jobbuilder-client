import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import useChat from "../../hooks/useChat";
import { ChatMessage } from "../../types/chat.types";
import { StaffProfile } from "../../types/staff.types";
import { Profile } from "../../types/profile.types";
import { UserProfile } from "../../types/user.types";
import useAuth from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { setMessages } from "../../redux/slices/chatSlice";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // Use the backend URL for serving static files
  // return `http://localhost:3000/uploads/${path}`;
  return `https://jobbuilder-server.onrender.com${path}`;
};

const ChatPage: React.FC = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch();
  const {
    messages,
    currentChat,
    chats,
    getChatMessages,
    sendMessage,
    getChatById,
    getChats,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const { id, role } = useAuth();
  const { socket, joinChat, leaveChat, sendTyping } = useSocket();

  useEffect(() => {
    getChats();
    if (chatId) {
      getChatById(chatId);
      getChatMessages(chatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // Socket.io setup for real-time messaging
  useEffect(() => {
    if (!socket || !chatId) return;

    // Join the chat room
    joinChat(chatId);

    // Listen for new messages
    const handleNewMessage = (message: ChatMessage) => {
      dispatch(setMessages([...messages, message]));
    };

    // Listen for typing indicators
    const handleUserTyping = ({
      userId,
      isTyping,
    }: {
      userId: string;
      isTyping: boolean;
    }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (isTyping && userId !== id) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });

      // Clear typing indicator after 3 seconds
      if (isTyping) {
        setTimeout(() => {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(userId);
            return newSet;
          });
        }, 3000);
      }
    };

    socket.on("new_message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);

    // Cleanup when leaving chat or component unmounting
    return () => {
      leaveChat(chatId);
      socket.off("new_message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
    };
  }, [socket, chatId, id, joinChat, leaveChat, dispatch, messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;

    try {
      const response = await sendMessage(currentChat._id, newMessage.trim());
      if (response?.success) {
        setNewMessage("");
        setError(null);
        // Stop typing indicator
        sendTyping(currentChat._id, false);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  // Handle typing indicator
  const handleTyping = (isTyping: boolean) => {
    if (currentChat) {
      sendTyping(currentChat._id, isTyping);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Send typing indicator
    if (e.target.value.trim() && !newMessage.trim()) {
      handleTyping(true);
    } else if (!e.target.value.trim() && newMessage.trim()) {
      handleTyping(false);
    }
  };

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays < 1) {
      return messageDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays < 7) {
      return messageDate.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return messageDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getStaffName = (staff: StaffProfile): string => {
    if (typeof staff.profile === "object") {
      const profile = staff.profile as Profile;
      return `${profile.firstName} ${profile.lastName}`;
    }
    return "Staff";
  };

  const getProfilePicture = (
    profileData: Profile | string | undefined
  ): string => {
    if (typeof profileData === "object" && profileData?.profilePicture) {
      return profileData.profilePicture;
    }
    return "";
  };

  const getProfileInfo = (profileData: Profile | string | undefined) => {
    if (typeof profileData === "object") {
      return {
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          style={{ height: "calc(100vh - 8rem)" }}
        >
          <div className="flex h-full">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p>No conversations found</p>
                  </div>
                ) : (
                  chats?.map((chat) => {
                    const staff =
                      typeof chat.staffId === "object"
                        ? (chat.staffId as StaffProfile)
                        : null;
                    const user =
                      typeof chat.userId === "object"
                        ? (chat.userId as UserProfile)
                        : null;

                    const displayProfile =
                      role === "user" ? staff?.profile : user?.profile;
                    const profilePicture = getProfilePicture(displayProfile);

                    return (
                      <div
                        key={chat._id}
                        onClick={() => {
                          getChatMessages(chat._id);
                          getChatById(chat._id);
                        }}
                        className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                          currentChat?._id === chat._id
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={
                                profilePicture
                                  ? getImageUrl(profilePicture)
                                  : "/api/placeholder/40/40"
                              }
                              alt={staff ? getStaffName(staff) : "Staff"}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {/* {staff ? getStaffName(staff) : "Staff"} */}
                                  {user?.profile?.firstName +
                                    " " +
                                    user?.profile?.lastName}
                                </p>
                              </div>
                              <p className="text-xs text-gray-500">
                                {formatTime(chat.updatedAt)}
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <p className="text-sm text-gray-600 truncate">
                                {chat.lastMessage}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          {typeof currentChat.staffId === "object" && (
                            <img
                              src={getImageUrl(
                                getProfilePicture(
                                  role === "user"
                                    ? (currentChat.staffId as StaffProfile)
                                        ?.profile
                                    : (currentChat.userId as UserProfile)
                                        ?.profile
                                )
                              )}
                              alt={getStaffName(
                                currentChat.staffId as StaffProfile
                              )}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-medium text-gray-900">
                            {role === "user"
                              ? (() => {
                                  const staffProfile = getProfileInfo(
                                    (currentChat.staffId as StaffProfile)
                                      ?.profile
                                  );
                                  return `${staffProfile.firstName} ${staffProfile.lastName} (${staffProfile.email})`;
                                })()
                              : (() => {
                                  const userProfile = getProfileInfo(
                                    (currentChat.userId as UserProfile)?.profile
                                  );
                                  return `${userProfile.firstName} ${userProfile.lastName} (${userProfile.email})`;
                                })()}
                          </h2>
                          {/* Typing indicator */}
                          {typingUsers.size > 0 && (
                            <p className="text-sm text-blue-500 italic">
                              {typingUsers.size === 1
                                ? "Someone is"
                                : "People are"}{" "}
                              typing...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages?.map((message: ChatMessage) => {
                      const senderId = message.senderId;
                      const isCurrentUser = senderId === id;

                      return (
                        <div
                          key={message._id}
                          className={`flex ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isCurrentUser
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isCurrentUser
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    {error && (
                      <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                      </div>
                    )}
                    <form
                      onSubmit={handleSendMessage}
                      className="flex space-x-4"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={handleInputChange}
                          onBlur={() => handleTyping(false)}
                          placeholder="Type a message..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                // No conversation selected
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      No conversation selected
                    </p>
                    <p className="text-gray-500">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
