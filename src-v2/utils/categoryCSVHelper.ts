import { JobCategory } from "../types";

/**
 * Utility functions for handling job category CSV export and import
 */

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
 * Generate a CSV template for job categories with parent-child relationships
 * @returns CSV string with sample categories
 */
export const generateCategoryCSVTemplate = (): string => {
  // Define the CSV headers
  const headers = ["Name", "Description", "ParentCategoryName"];

  // Create the CSV header row
  let csvContent = headers.join(",") + "\n";

  // Add multiple sample rows with parent-child relationships
  // Note: Parent categories must be listed before their children
  const sampleRows = [
    // Top-level categories (no parent)
    ["Technology", "All technology related jobs", ""],
    ["Healthcare", "Medical and healthcare positions", ""],
    ["Finance", "Financial services and banking jobs", ""],
    ["Education", "Educational and teaching positions", ""],
    ["Sales & Marketing", "Sales and marketing related roles", ""],

    // Second-level categories (with parent)
    [
      "Software Development",
      "Programming and software engineering jobs",
      "Technology",
    ],
    [
      "IT Support",
      "Technical support and infrastructure positions",
      "Technology",
    ],
    ["Data Science", "Data analysis and machine learning roles", "Technology"],
    ["UI/UX Design", "User interface and experience design", "Technology"],

    ["Nursing", "Registered nurses and nursing staff", "Healthcare"],
    ["Physicians", "Doctors and medical specialists", "Healthcare"],
    ["Mental Health", "Psychological and psychiatric services", "Healthcare"],

    ["Accounting", "Accounting and bookkeeping positions", "Finance"],
    ["Banking", "Retail and investment banking roles", "Finance"],
    ["Financial Analysis", "Financial data analysis and reporting", "Finance"],

    ["K-12 Teaching", "Primary and secondary education", "Education"],
    ["Higher Education", "University and college positions", "Education"],
    [
      "Educational Administration",
      "School management and leadership",
      "Education",
    ],

    [
      "Digital Marketing",
      "Online and digital advertising",
      "Sales & Marketing",
    ],
    [
      "Sales Representatives",
      "Product and service sales roles",
      "Sales & Marketing",
    ],
    [
      "Public Relations",
      "Media and public relations positions",
      "Sales & Marketing",
    ],

    // Third-level categories (with second-level parents)
    [
      "Frontend Development",
      "Web UI development with HTML, CSS, JavaScript",
      "Software Development",
    ],
    [
      "Backend Development",
      "Server-side and API development",
      "Software Development",
    ],
    [
      "Mobile Development",
      "iOS, Android and cross-platform app development",
      "Software Development",
    ],

    ["Network Support", "Network infrastructure and maintenance", "IT Support"],
    ["Desktop Support", "Hardware and software troubleshooting", "IT Support"],

    ["Machine Learning", "AI and ML algorithm development", "Data Science"],
    [
      "Business Intelligence",
      "Data analytics and visualization",
      "Data Science",
    ],
  ];

  // Add all sample rows to the CSV content
  sampleRows.forEach((row) => {
    // Escape any fields as needed
    const escapedRow = row.map((field) => escapeCsvField(field));
    csvContent += escapedRow.join(",") + "\n";
  });

  return csvContent;
};

/**
 * Download the category CSV template
 * @param filename Name for the downloaded file
 */
export const downloadCategoryCSVTemplate = (
  filename = "categories-import-template.csv"
): void => {
  // Get the template CSV content
  const csvContent = generateCategoryCSVTemplate();

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
 * Convert job categories to CSV format
 * @param categories Array of job category objects to convert
 * @returns CSV formatted string
 */
export const convertCategoriesToCSV = (categories: JobCategory[]): string => {
  // Define the CSV headers
  const headers = ["ID", "Name", "Description", "ParentCategoryName"];

  // Create the CSV header row
  let csvContent = headers.join(",") + "\n";

  // Create a map of IDs to names for easier parent lookup
  const categoryMap = new Map<string, string>();
  categories.forEach((cat) => {
    if (cat._id) {
      categoryMap.set(cat._id, cat.name);
    }
  });

  // Add each category as a row in the CSV
  categories.forEach((category) => {
    // Get the parent category name if it exists
    const parentName = category.parentCategory
      ? categoryMap.get(category.parentCategory) || ""
      : "";

    // Create array for the row, escaping fields that might contain commas
    const row = [
      category._id || "",
      escapeCsvField(category.name),
      escapeCsvField(category.description || ""),
      escapeCsvField(parentName),
    ];

    // Add the row to the CSV content
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
};

/**
 * Download job categories as a CSV file
 * @param categories Array of job category objects
 * @param filename Name for the downloaded file
 */
export const downloadCategoriesAsCSV = (
  categories: JobCategory[],
  filename = "categories-export.csv"
): void => {
  // Convert categories to CSV format
  const csvContent = convertCategoriesToCSV(categories);

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
 * Interface for category hierarchical structure
 */
interface CategoryWithChildren extends JobCategory {
  children: CategoryWithChildren[];
}

/**
 * Create a hierarchical representation of categories
 * Useful for displaying categories in a tree structure
 * @param categories Flat array of category objects
 * @returns Array of categories with nested children
 */
export const buildCategoryHierarchy = (
  categories: JobCategory[]
): CategoryWithChildren[] => {
  // Create a map for faster lookup
  const categoryMap = new Map<string, CategoryWithChildren>();

  // First pass: add all categories to the map
  categories.forEach((category) => {
    categoryMap.set(category._id, { ...category, children: [] });
  });

  // Second pass: build hierarchy
  const rootCategories: CategoryWithChildren[] = [];

  categoryMap.forEach((category) => {
    if (category.parentCategory) {
      const parent = categoryMap.get(category.parentCategory);
      if (parent) {
        parent.children.push(category);
      } else {
        // If parent isn't found, add to root
        rootCategories.push(category);
      }
    } else {
      // No parent means it's a root category
      rootCategories.push(category);
    }
  });

  return rootCategories;
};
