import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
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
} from "../redux/slices/chatSlice";
import { chatService } from "../services";
import { Chat, ChatMessage, ChatRequest, ChatMessageRequest } from "../types";

/**
 * Hook for managing chat-related actions
 */
const useChat = () => {
  const dispatch = useAppDispatch();
  const { chats, currentChat, messages, loading, error } = useAppSelector(
    (state) => state.chat
  );

  // API loading states
  const getChatsApi = useApiCall("getChats");
  const getChatApi = useApiCall("getChat");
  const getChatWithMessagesApi = useApiCall("getChatWithMessages");
  const createChatApi = useApiCall("createChat");
  const updateChatTitleApi = useApiCall("updateChatTitle");
  const deleteChatApi = useApiCall("deleteChat");
  const sendMessageApi = useApiCall("sendMessage");
  const getMessagesApi = useApiCall("getMessages");
  const deleteMessageApi = useApiCall("deleteMessage");
  const generateAIResponseApi = useApiCall("generateAIResponse");

  // Fetch all chats
  const fetchChats = useCallback(
    async (page = 1, limit = 10) => {
      dispatch(setChatLoading(true));
      const result = await getChatsApi.execute(
        () => chatService.getChats(page, limit),
        (data) => {
          if (data.data && data.data.items) {
            dispatch(setChats(data.data.items));
          }
          dispatch(setChatLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setChatError(result.error || "Failed to fetch chats"));
        dispatch(setChatLoading(false));
      }
      return result;
    },
    [dispatch, getChatsApi]
  );

  // Fetch a specific chat by ID
  const fetchChat = useCallback(
    async (chatId: string) => {
      dispatch(setChatLoading(true));
      const result = await getChatApi.execute(
        () => chatService.getChatById(chatId),
        (data) => {
          if (data.data) {
            dispatch(updateChat(data.data));
            dispatch(setCurrentChat(data.data));
          }
          dispatch(setChatLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setChatError(result.error || "Failed to fetch chat"));
        dispatch(setChatLoading(false));
      }
      return result;
    },
    [dispatch, getChatApi]
  );

  // Fetch chat with messages
  const fetchChatWithMessages = useCallback(
    async (chatId: string, page = 1, limit = 20) => {
      dispatch(setChatLoading(true));
      const result = await getChatWithMessagesApi.execute(
        () => chatService.getChatWithMessages(chatId, page, limit),
        (data) => {
          if (data.data) {
            dispatch(updateChat(data.data));
            dispatch(setCurrentChat(data.data));
            if (data.data.messages) {
              dispatch(
                setMessages({
                  chatId: data.data._id.toString(),
                  messages: data.data.messages,
                })
              );
            }
          }
          dispatch(setChatLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setChatError(result.error || "Failed to fetch chat with messages")
        );
        dispatch(setChatLoading(false));
      }
      return result;
    },
    [dispatch, getChatWithMessagesApi]
  );

  // Create a new chat
  const createChat = useCallback(
    async (chatData: ChatRequest) => {
      dispatch(setChatLoading(true));
      const result = await createChatApi.execute(
        () => chatService.createChat(chatData),
        (data) => {
          if (data.data) {
            dispatch(addChat(data.data));
            dispatch(setCurrentChat(data.data));
          }
          dispatch(setChatLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setChatError(result.error || "Failed to create chat"));
        dispatch(setChatLoading(false));
      }
      return result;
    },
    [dispatch, createChatApi]
  );

  // Update chat title
  const updateChatTitle = useCallback(
    async (chatId: string, title: string) => {
      dispatch(setChatLoading(true));
      const result = await updateChatTitleApi.execute(
        () => chatService.updateChatTitle(chatId, title),
        (data) => {
          if (data.data) {
            dispatch(updateChat(data.data));
            if (currentChat && currentChat._id === data.data._id) {
              dispatch(setCurrentChat(data.data));
            }
          }
          dispatch(setChatLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setChatError(result.error || "Failed to update chat title"));
        dispatch(setChatLoading(false));
      }
      return result;
    },
    [dispatch, updateChatTitleApi, currentChat]
  );

  // Delete a chat
  const removeChat = useCallback(
    async (chatId: string) => {
      dispatch(setChatLoading(true));
      const result = await deleteChatApi.execute(
        () => chatService.deleteChat(chatId),
        () => {
          dispatch(deleteChat(chatId));
          dispatch(setChatLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setChatError(result.error || "Failed to delete chat"));
        dispatch(setChatLoading(false));
      }
      return result;
    },
    [dispatch, deleteChatApi]
  );

  // Send a message
  const sendMessage = useCallback(
    async (chatId: string, messageData: ChatMessageRequest) => {
      dispatch(setChatLoading(true));
      const result = await sendMessageApi.execute(
        () => chatService.sendMessage(chatId, messageData),
        (data) => {
          if (data.data) {
            dispatch(addMessage({ chatId, message: data.data }));
          }
          dispatch(setChatLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setChatError(result.error || "Failed to send message"));
        dispatch(setChatLoading(false));
      }
      return result;
    },
    [dispatch, sendMessageApi]
  );

  // Fetch messages for a chat
  const fetchMessages = useCallback(
    async (chatId: string, page = 1, limit = 20) => {
      dispatch(setChatLoading(true));
      const result = await getMessagesApi.execute(
        () => chatService.getMessages(chatId, page, limit),
        (data) => {
          if (data.data && data.data.items) {
            dispatch(setMessages({ chatId, messages: data.data.items }));
          }
          dispatch(setChatLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(setChatError(result.error || "Failed to fetch messages"));
        dispatch(setChatLoading(false));
      }
      return result;
    },
    [dispatch, getMessagesApi]
  );

  // Generate AI response
  const generateAIResponse = useCallback(
    async (chatId: string, userMessage: string) => {
      dispatch(setChatLoading(true));
      const result = await generateAIResponseApi.execute(
        () => chatService.generateAIResponse(chatId, userMessage),
        (data) => {
          if (data.data) {
            dispatch(addMessage({ chatId, message: data.data }));
          }
          dispatch(setChatLoading(false));
        }
      );
      if (result && !result.success) {
        dispatch(
          setChatError(result.error || "Failed to generate AI response")
        );
        dispatch(setChatLoading(false));
      }
      return result;
    },
    [dispatch, generateAIResponseApi]
  );

  // Set the current chat
  const selectChat = useCallback(
    (chat: Chat | null) => {
      dispatch(setCurrentChat(chat));
    },
    [dispatch]
  );

  // Clear chat state
  const clearChats = useCallback(() => {
    dispatch(resetChat());
  }, [dispatch]);

  // Get messages for the current chat
  const getCurrentChatMessages = useCallback(() => {
    if (!currentChat) return [];
    return messages[currentChat._id.toString()] || [];
  }, [currentChat, messages]);

  return {
    // State
    chats,
    currentChat,
    messages,
    loading,
    error,
    currentChatMessages: getCurrentChatMessages(),

    // Methods
    fetchChats,
    fetchChat,
    fetchChatWithMessages,
    createChat,
    updateChatTitle,
    deleteChat: removeChat,
    sendMessage,
    fetchMessages,
    generateAIResponse,
    selectChat,
    clearChats,
  };
};

export default useChat;
