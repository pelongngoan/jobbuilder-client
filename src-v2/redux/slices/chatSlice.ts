import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, ChatMessage } from "../../types";

// Define chat state structure
interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Record<string, ChatMessage[]>; // chatId -> messages
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: {},
  loading: false,
  error: null,
};

// Create the chat slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Loading and error states
    setChatLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setChatError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Chat collection actions
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload); // Add to beginning

      // Initialize messages array for this chat
      if (!state.messages[action.payload._id]) {
        state.messages[action.payload._id] = [];
      }
    },
    updateChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chats.findIndex(
        (chat) => chat._id === action.payload._id
      );
      if (index !== -1) {
        state.chats[index] = action.payload;

        // Also update currentChat if it's the same chat
        if (state.currentChat && state.currentChat._id === action.payload._id) {
          state.currentChat = action.payload;
        }
      }
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(
        (chat) => chat._id.toString() !== action.payload
      );

      // Clear currentChat if it's the deleted chat
      if (
        state.currentChat &&
        state.currentChat._id.toString() === action.payload
      ) {
        state.currentChat = null;
      }

      // Delete messages for this chat
      delete state.messages[action.payload];
    },

    // Current chat actions
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;

      // Initialize messages array for this chat if it doesn't exist
      if (action.payload && !state.messages[action.payload._id]) {
        state.messages[action.payload._id] = [];
      }
    },

    // Message actions
    setMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: ChatMessage[] }>
    ) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; message: ChatMessage }>
    ) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);

      // Update the last message in the chat list
      const chatIndex = state.chats.findIndex(
        (chat) => chat._id.toString() === chatId
      );
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = message.content;

        // Move this chat to the top of the list
        const chat = state.chats[chatIndex];
        state.chats.splice(chatIndex, 1);
        state.chats.unshift(chat);
      }
    },

    // Reset state
    resetChat: (state) => {
      state.chats = [];
      state.currentChat = null;
      state.messages = {};
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  setChatLoading,
  setChatError,
  setChats,
  addChat,
  updateChat,
  deleteChat,
  setCurrentChat,
  setMessages,
  addMessage,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
