import { User } from "./user.types";

export interface Notification {
  _id?: string;
  userId?: string | User;
  type?: "job_application" | "chat_message";
  content?: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
