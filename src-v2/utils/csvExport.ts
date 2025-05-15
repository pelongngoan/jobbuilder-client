import { Job, JobWithReferences } from "../types/job.types";

/**
 * Convert jobs data to CSV format
 * @param jobs Array of job objects to convert
 * @returns CSV formatted string
 */
export const convertJobsToCSV = (jobs: (Job | JobWithReferences)[]): string => {
  // Define the CSV headers
  const headers = [
    "ID",
    "Title",
    "Description",
    "Location",
    "Job Type",
    "Experience Level",
    "Salary Range",
    "Salary Currency",
    "Skills",
    "Company Name",
    "Company ID",
    "Category",
    "Status",
    "Posted Date",
    "Deadline",
  ];

  // Create the CSV header row
  let csvContent = headers.join(",") + "\n";

  // Add each job as a row in the CSV
  jobs.forEach((job) => {
    // Format skills as a semicolon-separated list
    const skillNames =
      "skillDetails" in job && job.skillDetails
        ? job.skillDetails.map((skill) => skill.name).join(";")
        : "";

    // Format date fields
    const postedDate = job.createdAt
      ? new Date(job.createdAt).toISOString().split("T")[0]
      : "";
    const deadline = job.deadline
      ? new Date(job.deadline).toISOString().split("T")[0]
      : "";

    // Format category name
    const category =
      "categoryDetails" in job && job.categoryDetails
        ? job.categoryDetails.name
        : "";

    // Create array for the row, escaping fields that might contain commas
    const row = [
      job._id,
      escapeCsvField(job.title),
      escapeCsvField(job.description || ""),
      escapeCsvField(job.location || ""),
      job.jobType || "",
      job.experienceLevel || "",
      job.salaryRange || "",
      job.salaryCurrency || "",
      escapeCsvField(skillNames),
      escapeCsvField(job.companyName || ""),
      job.companyId || "",
      escapeCsvField(category),
      job.status || "",
      postedDate,
      deadline,
    ];

    // Add the row to the CSV content
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
};

/**
 * Escape CSV field to handle commas and quotes
 * @param field Field value to escape
 * @returns Escaped field value
 */
export const escapeCsvField = (field: string): string => {
  // If the field contains commas, quotes or newlines, wrap it in quotes
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    // Replace any quotes with double quotes (CSV standard)
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
};

/**
 * Download jobs data as a CSV file
 * @param jobs Array of job objects
 * @param filename Name for the downloaded file
 */
export const downloadJobsAsCSV = (
  jobs: (Job | JobWithReferences)[],
  filename = "jobs-export.csv"
): void => {
  // Convert jobs to CSV format
  const csvContent = convertJobsToCSV(jobs);

  // Create a Blob containing the CSV data
  const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a URL for the Blob
  const csvUrl = URL.createObjectURL(csvBlob);

  // Create a link element to trigger the download
  const link = document.createElement("a");
  link.href = csvUrl;
  link.setAttribute("download", filename);

  // Add the link to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke the URL to free up memory
  setTimeout(() => {
    URL.revokeObjectURL(csvUrl);
  }, 100);
};

/**
 * Create a template CSV file for job imports
 * @returns CSV template as a string
 */
export const createJobImportTemplate = (): string => {
  // Define the CSV headers
  const headers = [
    "Title",
    "Description",
    "Location",
    "Job Type",
    "Experience Level",
    "Salary Range",
    "Salary Currency",
    "Skills",
    "Category",
    "Deadline",
  ];

  // Create the CSV header row
  let csvContent = headers.join(",") + "\n";

  // Add a sample row with field format examples
  const sampleRow = [
    "Software Developer",
    "We are looking for a skilled developer...",
    "New York, NY",
    "full-time", // Example valid job type
    "Mid", // Example valid experience level
    "60000-80000", // Format: min-max
    "USD",
    "JavaScript;React;Node.js", // Semicolon-separated skills
    "Technology", // Category name
    "2023-12-31", // Format: YYYY-MM-DD
  ];

  // Add the sample row to the CSV content
  csvContent += sampleRow.join(",") + "\n";

  return csvContent;
};

/**
 * Download a template CSV file for job imports
 * @param filename Name for the downloaded file
 */
export const downloadJobImportTemplate = (
  filename = "jobs-import-template.csv"
): void => {
  // Get the template CSV content
  const csvContent = createJobImportTemplate();

  // Create a Blob containing the CSV data
  const csvBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a URL for the Blob
  const csvUrl = URL.createObjectURL(csvBlob);

  // Create a link element to trigger the download
  const link = document.createElement("a");
  link.href = csvUrl;
  link.setAttribute("download", filename);

  // Add the link to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke the URL to free up memory
  setTimeout(() => {
    URL.revokeObjectURL(csvUrl);
  }, 100);
};
