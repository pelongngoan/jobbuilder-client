import apiClient from "./api";

interface MonthlyStats {
  month: string;
  users: number;
  jobs: number;
  applications: number;
}

interface ApplicationsByStatus {
  pending: number;
  reviewed: number;
  shortlisted: number;
  interview: number;
  accepted: number;
  rejected: number;
}

interface RecentUser {
  _id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
  };
}

interface RecentApplication {
  _id: string;
  userId: {
    profile: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  jobId: {
    title: string;
  };
  resumeId: {
    title: string;
  };
  status: string;
  appliedAt: string;
}

interface RecentJob {
  _id: string;
  title: string;
  location: string;
  applicationCount: number;
  status: string;
  createdAt: string;
}

interface MonthlyApplications {
  month: string;
  applications: number;
}

export interface DashboardStats {
  // Admin stats
  totalUsers?: number;
  totalCompanies?: number;
  totalJobs?: number;
  totalApplications?: number;
  recentUsers?: RecentUser[];
  monthlyStats?: MonthlyStats[];

  // Company stats
  activeJobs?: number;
  pendingApplications?: number;
  acceptedApplications?: number;
  rejectedApplications?: number;
  recentApplications?: RecentApplication[];
  recentJobs?: RecentJob[];
  applicationsByStatus?: ApplicationsByStatus;
  monthlyApplications?: MonthlyApplications[];

  // Staff stats
  pendingReview?: number;
  interviewsScheduled?: number;
  applicationsReviewed?: number;
  todayApplications?: number;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data.data;
  },
};
