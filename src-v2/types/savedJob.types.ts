import { ObjectId } from "./common.types";
import { Job } from "./job.types";

// Saved job interface matching the backend model
export interface SavedJob {
  _id: ObjectId;
  userId: ObjectId;
  jobId: ObjectId;
  savedAt: Date | string;
}

// Saved job with populated job data
export interface SavedJobWithDetails extends SavedJob {
  job?: Job;
}

// Saved job request
export interface SavedJobRequest {
  jobId: ObjectId;
}
