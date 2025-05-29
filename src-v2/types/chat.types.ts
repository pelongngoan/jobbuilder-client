import { StaffProfile } from "./staff.types";
import { UserProfile } from "./user.types";

export interface Chat {
  _id: string;
  userId: UserProfile | string;
  staffId?: StaffProfile | string;
  lastMessage: string;
  chatType: "ai_assistance" | "user_support" | "job_inquiry";
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  _id: string;
  chatId: Chat | string;
  senderId: UserProfile | StaffProfile | string;
  content: string;
  createdAt: string;
}
