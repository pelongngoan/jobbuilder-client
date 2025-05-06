export interface JobPost {
  [key: string]: unknown;
  _id: string;
  title: string;
  category: string;
  location: string;
  jobType: string;
  status: string;
  applications: string[];
  createdAt: string;
  salaryRange: string;
  salary: number;
  salaryCurrency: string;
  salaryType: "hourly" | "monthly" | "yearly";
  requirements: string[];
  benefits: string[];
  keyResponsibilities: string[];
  companyName: string;
  deadline: string;
  description: string;
  experienceLevel?: "Entry" | "Mid" | "Senior" | "Executive";
  other?: {
    title: string;
    description: string;
  };
}
