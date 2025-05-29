import { createSlice } from "@reduxjs/toolkit";
import { Chat, ChatMessage } from "../../types/chat.types";

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: ChatMessage[];
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = null;
    },
    clearChats: (state) => {
      state.chats = [];
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  setChats,
  setCurrentChat,
  clearCurrentChat,
  clearChats,
  setMessages,
  clearMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
