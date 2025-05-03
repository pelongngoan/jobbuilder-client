import React, { useState } from "react";
import {
  Search,
  Send,
  User,
  Phone,
  Video,
  Paperclip,
  MoreVertical,
} from "lucide-react";

// Mock data for conversations
const initialConversations = [
  {
    id: 1,
    name: "John Smith",
    avatar: "JS",
    lastMessage: "When can I expect to hear back about my application?",
    time: "10:30 AM",
    unread: true,
    messages: [
      {
        id: 1,
        text: "Hello, I applied for the Frontend Developer position last week.",
        sender: "John Smith",
        time: "10:15 AM",
      },
      {
        id: 2,
        text: "When can I expect to hear back about my application?",
        sender: "John Smith",
        time: "10:30 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Emily Chen",
    avatar: "EC",
    lastMessage: "Thank you for the interview opportunity!",
    time: "Yesterday",
    unread: false,
    messages: [
      {
        id: 1,
        text: "Thank you for inviting me for an interview.",
        sender: "Emily Chen",
        time: "Yesterday",
      },
      {
        id: 2,
        text: "I'm looking forward to discussing the UX Designer position.",
        sender: "Emily Chen",
        time: "Yesterday",
      },
      {
        id: 3,
        text: "Thank you for the interview opportunity!",
        sender: "Emily Chen",
        time: "Yesterday",
      },
      {
        id: 4,
        text: "We're excited to meet you, Emily. See you on Thursday at 2pm.",
        sender: "You",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    avatar: "MR",
    lastMessage: "I understand, thank you for considering my application.",
    time: "May 1",
    unread: false,
    messages: [
      {
        id: 1,
        text: "Hello, I'm following up on my Product Manager application.",
        sender: "Michael Rodriguez",
        time: "May 1",
      },
      {
        id: 2,
        text: "We appreciate your interest, but we're looking for someone with more product management experience.",
        sender: "You",
        time: "May 1",
      },
      {
        id: 3,
        text: "I understand, thank you for considering my application.",
        sender: "Michael Rodriguez",
        time: "May 1",
      },
    ],
  },
  {
    id: 4,
    name: "Sarah Johnson",
    avatar: "SJ",
    lastMessage: "I've completed the technical test and submitted it.",
    time: "Apr 30",
    unread: true,
    messages: [
      {
        id: 1,
        text: "I've received the coding test for the Frontend Developer position.",
        sender: "Sarah Johnson",
        time: "Apr 30",
      },
      {
        id: 2,
        text: "Great! Please complete it within 48 hours.",
        sender: "You",
        time: "Apr 30",
      },
      {
        id: 3,
        text: "I've completed the technical test and submitted it.",
        sender: "Sarah Johnson",
        time: "Apr 30",
      },
    ],
  },
];

export const MessagesPage = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // Filter conversations based on search term
  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const updatedMessage = {
      id: selectedConversation.messages.length + 1,
      text: newMessage,
      sender: "You",
      time: "Just now",
    };

    const updatedConversations = conversations.map((convo) => {
      if (convo.id === selectedConversation.id) {
        return {
          ...convo,
          messages: [...convo.messages, updatedMessage],
          lastMessage: newMessage,
          time: "Just now",
          unread: false,
        };
      }
      return convo;
    });

    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, updatedMessage],
      lastMessage: newMessage,
      time: "Just now",
    });
    setNewMessage("");
  };

  const handleSelectConversation = (conversation) => {
    // Mark as read when selecting
    if (conversation.unread) {
      const updatedConversations = conversations.map((convo) =>
        convo.id === conversation.id ? { ...convo, unread: false } : convo
      );
      setConversations(updatedConversations);
    }
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex h-[96vh] overflow-hidden">
      {/* Conversations sidebar */}
      <div className="w-1/3 border-r flex flex-col bg-white">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? "bg-blue-50" : ""
              }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 mr-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                    {conversation.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && (
                  <div className="ml-2 h-3 w-3 bg-blue-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}

          {filteredConversations.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Chat area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat header */}
          <div className="px-6 py-4 border-b bg-white flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold mr-3">
                {selectedConversation.avatar}
              </div>
              <div>
                <h3 className="font-medium">{selectedConversation.name}</h3>
                <p className="text-xs text-gray-500">Applicant</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Phone className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Video className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <MoreVertical className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "You" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.sender === "You"
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.sender === "You"
                        ? "text-blue-200"
                        : "text-gray-500"
                    }`}
                  >
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center">
              <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                <Paperclip className="h-5 w-5 text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <button
                className="ml-2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleSendMessage}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center text-gray-500">
            <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-1">
              No conversation selected
            </h3>
            <p>Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
