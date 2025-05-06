export interface Application {
  _id: string;
  userId: string;
  jobId: string;
  resumeId: string;
  status:
    | "pending"
    | "reviewed"
    | "accepted"
    | "rejected"
    | "shortlisted"
    | "New"
    | "In Review"
    | "Shortlisted"
    | "Rejected"
    | "Offer Extended";
  appliedAt: string;
  updatedAt: string;
  applicantName?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  resumeUrl?: string;
  rating?: number;
  stage?: string;
  hrAssigned?: string;
  notes?: string;
}
