import { ObjectId } from "./common.types";

// Privacy setting type
export type PrivacyType = "public" | "private";

// Settings interface matching the backend model
export interface Settings {
  _id: ObjectId;
  userId: ObjectId;
  notifications: boolean;
  privacy: PrivacyType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Settings update request
export interface SettingsUpdateRequest {
  notifications?: boolean;
  privacy?: PrivacyType;
}
