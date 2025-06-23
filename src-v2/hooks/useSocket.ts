import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      return;
    }

    // Initialize socket connection
    const socket = io(
      // "http://localhost:3000",
      "https://jobbuilder-server.onrender.com",
      {
        auth: {
          token: token,
        },
        autoConnect: true,
      }
    );

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const joinChat = (chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("join_chat", chatId);
    }
  };

  const leaveChat = (chatId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("leave_chat", chatId);
    }
  };

  const sendTyping = (chatId: string, isTyping: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit("typing", { chatId, isTyping });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinChat,
    leaveChat,
    sendTyping,
  };
};
