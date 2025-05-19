import { User } from "./user.types";

// Job type for job search preferences
export type JobPreferenceType =
  | "full-time"
  | "part-time"
  | "contract"
  | "internship"
  | "remote";
export interface Profile {
  userId?: User;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  profilePicture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
