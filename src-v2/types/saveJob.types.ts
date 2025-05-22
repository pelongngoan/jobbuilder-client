import { JobPost } from "./job.types";
import { UserProfile } from "./user.types";

export interface SavedJob {
  _id: string;
  jobId: JobPost;
  userId: UserProfile;
  createdAt: Date;
}
