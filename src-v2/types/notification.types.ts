import { ObjectId } from "./common.types";

// Notification type
export type NotificationType =
  | "application_status"
  | "job_recommendation"
  | "message"
  | "system";

// Reference model type
export type ReferenceModelType =
  | "Job"
  | "Application"
  | "Chat"
  | "Company"
  | "User";

// Notification interface matching the backend model
export interface Notification {
  _id: ObjectId;
  userId: ObjectId;
  type: NotificationType;
  content: string;
  isRead: boolean;
  referenceId?: ObjectId;
  referenceModel?: ReferenceModelType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Notification with populated reference
export interface NotificationWithReference extends Notification {
  reference?: {
    _id: ObjectId;
    // Using a record with string keys and unknown values since reference
    // could be of different types based on referenceModel
    [key: string]: unknown;
  };
}

// Notification creation request
export interface NotificationRequest {
  userId: ObjectId;
  type: NotificationType;
  content: string;
  referenceId?: ObjectId;
  referenceModel?: ReferenceModelType;
}

// Notification update (for marking as read)
export interface NotificationUpdateRequest {
  isRead: boolean;
}
