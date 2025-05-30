import { User } from "./user.types";

export interface Notification {
  _id?: string;
  userId?: string | User;
  type?:
    | "job_application"
    | "chat_message"
    | "application_status"
    | "interview_scheduled"
    | "application_assigned";
  content?: string;
  title?: string;
  isRead?: boolean;
  relatedId?: string;
  relatedType?: "application" | "job" | "chat" | "interview";
  actionUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
