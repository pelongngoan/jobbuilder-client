import { JobPost } from "./JobCard";
import Papa from "papaparse";

export const generateJobPostCSVTemplate = (): string => {
  const headers = [
    "title",
    "companyName",
    "location",
    "jobType",
    "category",
    "salaryRange",
    "salary",
    "salaryCurrency",
    "salaryType",
    "status",
    "deadline",
    "description",
    "requirements",
    "benefits",
    "keyResponsibilities",
    "contactEmail",
    "contactPhone",
    "companyWebsite",
  ];

  const sampleRow = [
    "Frontend Developer",
    "Tech Innovators Inc.",
    "Remote",
    "full-time",
    "Software Development",
    "$3000 - $5000",
    "4000",
    "USD",
    "monthly",
    "open",
    "2025-06-01",
    "We are looking for a skilled Frontend Developer to join our dynamic team.",
    "3+ years of experience with React.js, Strong knowledge of HTML/CSS/JavaScript",
    "Health insurance, Flexible working hours, Remote work",
    "Develop user-facing features, Ensure the technical feasibility of UI/UX designs",
    "hr@company.com",
    "+1234567890",
    "https://techinnovators.io",
  ];

  let csvContent = headers.join(",") + "\n";
  csvContent += sampleRow.join(",");

  return csvContent;
};

export const processJobPostCSVImport = async (
  csvData: string
): Promise<Partial<JobPost>[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const jobPosts = results.data.map((row: any) => {
          const processArrayField = (field: string | undefined) => {
            if (!field) return [];
            return field.split(",").map((item: string) => item.trim());
          };

          const jobPost: Partial<JobPost> = {
            title: row.title,
            companyName: row.companyName,
            location: row.location,
            jobType: row.jobType,
            category: row.category,
            salaryRange: row.salaryRange,
            salary: Number(row.salary),
            salaryCurrency: row.salaryCurrency,
            salaryType: row.salaryType,
            status: row.status || "draft",
            deadline: row.deadline,
            description: row.description,
            requirements: processArrayField(row.requirements),
            benefits: processArrayField(row.benefits),
            keyResponsibilities: processArrayField(row.keyResponsibilities),
            contactEmail: row.contactEmail,
            contactPhone: row.contactPhone,
            companyWebsite: row.companyWebsite,
            applications: [],
            createdAt: new Date().toISOString(),
          };

          return jobPost;
        });

        resolve(jobPosts);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const downloadFile = (
  content: string,
  fileName: string,
  contentType: string
): void => {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
};

export const downloadCSVTemplate = (): void => {
  const csvContent = generateJobPostCSVTemplate();
  downloadFile(csvContent, "job_post_template.csv", "text/csv");
};
