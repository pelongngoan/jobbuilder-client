import { ApiResponse, CUDResponse } from "../types/common.types";
import { GetResponse } from "../types/common.types";
import api from "./api";

const chatService = {
  createChat: async (userId: string, staffId: string) => {
    const response = await api.post<ApiResponse<CUDResponse>>("/chats", {
      userId,
      staffId,
      chatType: "user_support",
    });
    return response.data;
  },
  getChats: async () => {
    const response = await api.get<ApiResponse<GetResponse>>("/chats");
    return response.data;
  },
  getChatById: async (chatId: string) => {
    const response = await api.get<ApiResponse<GetResponse>>(
      `/chats/${chatId}`
    );
    return response.data;
  },
  getChatByReceiverId: async (receiverId: string) => {
    const response = await api.get<ApiResponse<GetResponse>>(
      `/chats/receiver/${receiverId}`
    );
    return response.data;
  },
  getChatMessages: async (chatId: string) => {
    const response = await api.get<ApiResponse<GetResponse>>(
      `/chats/${chatId}/messages`
    );
    return response.data;
  },
  sendMessage: async (chatId: string, message: string) => {
    const response = await api.post<ApiResponse<CUDResponse>>(
      `/chats/${chatId}/messages`,
      { content: message }
    );
    return response.data;
  },
  deleteChat: async (chatId: string) => {
    const response = await api.delete<ApiResponse<CUDResponse>>(
      `/chats/${chatId}`
    );
    return response.data;
  },
};

export default chatService;
