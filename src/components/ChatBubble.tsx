import { User, Bot } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export const ChatBubble = ({ message, isUser, timestamp }: ChatBubbleProps) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mr-2 flex-shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}

      <div
        className={`chat-bubble ${
          isUser ? "chat-bubble-user" : "chat-bubble-assistant"
        } max-w-[80%]`}
      >
        <p className="text-sm">{message}</p>
        {timestamp && (
          <p className="text-xs opacity-70 mt-1 text-right">{timestamp}</p>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-2 flex-shrink-0">
          <User size={16} className="text-white" />
        </div>
      )}
    </div>
  );
};
