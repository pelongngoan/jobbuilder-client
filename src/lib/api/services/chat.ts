import { apiRequest } from "../axios";
import type { Job } from "../../../types/api";

export interface Chat {
  _id: string;
  userId: string;
  title: string;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
  jobRecommendations?: Job[];
  createdAt: string;
  updatedAt: string;
}

// Create a new chat session
export const createChat = async (title: string): Promise<Chat> => {
  const res = await apiRequest.post("/chat", { title });
  return res.data;
};

// Get all chats for the authenticated user
export const getChats = async (): Promise<Chat[]> => {
  const res = await apiRequest.get("/chat");
  return res.data;
};

// Get messages for a specific chat
export const getChatMessages = async (
  chatId: string
): Promise<ChatMessage[]> => {
  const res = await apiRequest.get(`/chat/${chatId}/messages`);
  return res.data;
};

// Send a message in a chat
export const sendMessage = async (
  chatId: string,
  content: string
): Promise<{ userMessage: ChatMessage; assistantMessage: ChatMessage }> => {
  const res = await apiRequest.post(`/chat/${chatId}/messages`, { content });
  return res.data;
};

// Delete a chat session
export const deleteChat = async (chatId: string): Promise<void> => {
  await apiRequest.delete(`/chat/${chatId}`);
};
