import { useDispatch, useSelector } from "react-redux";
import {
  setChats,
  setCurrentChat,
  setMessages,
} from "../redux/slices/chatSlice";
import { RootState } from "../redux/store";
import chatService from "../services/chatService";

const useChat = () => {
  const dispatch = useDispatch();

  const { chats, currentChat, messages } = useSelector(
    (state: RootState) => state.chat
  );

  const createChat = async (userId: string, staffId: string) => {
    const response = await chatService.createChat(userId, staffId);
    dispatch(setCurrentChat(response.data));
    return response;
  };

  const getChats = async () => {
    const response = await chatService.getChats();
    dispatch(setChats(response.data));
    return response;
  };

  const getChatById = async (chatId: string) => {
    const response = await chatService.getChatById(chatId);
    dispatch(setCurrentChat(response.data));
    return response;
  };

  const getChatByReceiverId = async (receiverId: string) => {
    const response = await chatService.getChatByReceiverId(receiverId);
    console.log(response);
    if (response.success && response.data) {
      dispatch(setCurrentChat(response.data));
    }
    return response;
  };

  const getChatMessages = async (chatId: string) => {
    const response = await chatService.getChatMessages(chatId);
    dispatch(setMessages(response.data));
    return response;
  };

  const sendMessage = async (chatId: string, message: string) => {
    const response = await chatService.sendMessage(chatId, message);
    dispatch(setMessages(response.data));
    return response;
  };

  const deleteChat = async (chatId: string) => {
    const response = await chatService.deleteChat(chatId);
    // dispatch(setChats(response.data));
    return response;
  };

  return {
    createChat,
    getChats,
    getChatMessages,
    sendMessage,
    deleteChat,
    getChatById,
    getChatByReceiverId,
    chats,
    currentChat,
    messages,
  };
};

export default useChat;
