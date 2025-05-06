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
  salaryType: string;
  requirements: string[];
  benefits: string[];
  keyResponsibilities: string[];
  companyName: string;
  deadline: string;
  description: string;
  other?: {
    title: string;
    description: string;
  };
}
