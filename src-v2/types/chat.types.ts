import { ObjectId } from "./common.types";

// Chat message role type
export type ChatRole = "user" | "assistant";

// Chat interface matching the backend model
export interface Chat {
  _id: ObjectId;
  userId: ObjectId;
  title: string;
  lastMessage: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Chat message interface matching the backend model
export interface ChatMessage {
  _id: ObjectId;
  chatId: ObjectId;
  content: string;
  role: ChatRole;
  jobRecommendations?: ObjectId[];
  createdAt: Date | string;
}

// Chat message with populated job recommendations
export interface ChatMessageWithJobs extends ChatMessage {
  jobRecommendationsData?: Array<{
    _id: ObjectId;
    title: string;
    companyName?: string;
    location: string;
    jobType: string;
  }>;
}

// Chat creation request
export interface ChatRequest {
  title: string;
}

// Chat message creation request
export interface ChatMessageRequest {
  content: string;
  role: ChatRole;
  jobRecommendations?: ObjectId[];
}

// Chat with messages
export interface ChatWithMessages extends Chat {
  messages: ChatMessage[];
}
