import apiClient from "./api";
import {
  Chat,
  ChatMessage,
  ChatRequest,
  ChatMessageRequest,
  ChatWithMessages,
} from "../types";
import { ApiResponse, PaginatedResponse } from "../types/common.types";

// Chat service
const chatService = {
  // Get all chats for current user
  getChats: async (page = 1, limit = 10) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Chat>>>(
      "/chats",
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Get chat by ID
  getChatById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Chat>>(`/chats/${id}`);
    return response.data;
  },

  // Get chat with messages
  getChatWithMessages: async (chatId: string, page = 1, limit = 20) => {
    const response = await apiClient.get<ApiResponse<ChatWithMessages>>(
      `/chats/${chatId}/messages`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  // Create new chat
  createChat: async (chatData: ChatRequest) => {
    const response = await apiClient.post<ApiResponse<Chat>>(
      "/chats",
      chatData
    );
    return response.data;
  },

  // Update chat title
  updateChatTitle: async (id: string, title: string) => {
    const response = await apiClient.put<ApiResponse<Chat>>(`/chats/${id}`, {
      title,
    });
    return response.data;
  },

  // Delete chat
  deleteChat: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/chats/${id}`
    );
    return response.data;
  },

  // Send message to chat
  sendMessage: async (chatId: string, messageData: ChatMessageRequest) => {
    const response = await apiClient.post<ApiResponse<ChatMessage>>(
      `/chats/${chatId}/messages`,
      messageData
    );
    return response.data;
  },

  // Get messages for a chat
  getMessages: async (chatId: string, page = 1, limit = 20) => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<ChatMessage>>
    >(`/chats/${chatId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Delete message
  deleteMessage: async (chatId: string, messageId: string) => {
    const response = await apiClient.delete<ApiResponse<boolean>>(
      `/chats/${chatId}/messages/${messageId}`
    );
    return response.data;
  },

  // Generate AI response
  generateAIResponse: async (chatId: string, userMessage: string) => {
    const response = await apiClient.post<ApiResponse<ChatMessage>>(
      `/chats/${chatId}/generate`,
      {
        message: userMessage,
      }
    );
    return response.data;
  },
};

export default chatService;
