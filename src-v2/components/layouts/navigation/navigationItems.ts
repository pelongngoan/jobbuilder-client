// Navigation items for the JobBuilder application

// Job categories for dropdown menu
export const JOB_CATEGORIES = [
  { id: "it", name: "IT & Software Development" },
  { id: "marketing", name: "Marketing" },
  { id: "finance", name: "Finance & Accounting" },
  { id: "hr", name: "Human Resources" },
  { id: "sales", name: "Sales" },
  { id: "engineering", name: "Engineering" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
];

// Career tools for dropdown menu
export const CAREER_TOOLS = [
  { id: "resume", path: "/resume-builder", name: "Resume Builder" },
  { id: "cover-letter", path: "/cover-letter", name: "Cover Letter Generator" },
  { id: "salary", path: "/salary-calculator", name: "Salary Calculator" },
  { id: "advice", path: "/career-advice", name: "Career Advice" },
];

// Main navigation links (visible to all users)
export const MAIN_NAV_LINKS = [
  { id: "jobs", path: "/jobs", name: "Jobs", hasDropdown: true },
  {
    id: "companies",
    path: "/companies",
    name: "Companies",
    hasDropdown: false,
  },
  { id: "tools", path: "", name: "Tools", hasDropdown: true },
];

// User role-specific menu items
export interface MenuItem {
  id: string;
  path: string;
  name: string;
  role?: string | string[];
  icon?: string;
}

// Dashboard items for regular users
export const USER_MENU_ITEMS: MenuItem[] = [
  { id: "dashboard", path: "/dashboard/user", name: "Dashboard" },
  { id: "search-jobs", path: "/dashboard/user/jobs", name: "Search Jobs" },
  { id: "saved-jobs", path: "/dashboard/user/saved-jobs", name: "Saved Jobs" },
  {
    id: "applications",
    path: "/dashboard/user/applications",
    name: "My Applications",
  },
  { id: "resumes", path: "/dashboard/user/resume", name: "Manage Resumes" },
  { id: "profile", path: "/profile", name: "Profile" },
];

// Dashboard items for company/HR users
export const COMPANY_MENU_ITEMS: MenuItem[] = [
  { id: "dashboard", path: "/management", name: "Dashboard" },
  { id: "manage-jobs", path: "/management/jobs", name: "Manage Jobs" },
  { id: "post-job", path: "/management/jobs/create", name: "Post New Job" },
  {
    id: "manage-applications",
    path: "/management/applications",
    name: "Manage Applications",
  },
  {
    id: "hr-team",
    path: "/management/hr-team",
    name: "Manage HR Team",
    role: "company",
  },
  { id: "analytics", path: "/management/analytics", name: "Analytics" },
  { id: "profile", path: "/profile", name: "Company Profile" },
];

// Dashboard items for admin users
export const ADMIN_MENU_ITEMS: MenuItem[] = [
  { id: "dashboard", path: "/admin/dashboard", name: "Dashboard" },
  { id: "users", path: "/admin/users", name: "Manage Users" },
  { id: "companies", path: "/admin/companies", name: "Manage Companies" },
  { id: "jobs", path: "/admin/jobs", name: "Manage Jobs" },
  { id: "skills", path: "/admin/skills", name: "Manage Skills" },
  {
    id: "job-categories",
    path: "/admin/job-categories",
    name: "Job Categories",
  },
  { id: "applications", path: "/admin/applications", name: "All Applications" },
];

// Mobile menu items with categories
export const MOBILE_JOB_CATEGORIES = [
  { id: "all", path: "/jobs", name: "All Jobs" },
  { id: "it", path: "/jobs?category=it", name: "IT & Software Development" },
  { id: "marketing", path: "/jobs?category=marketing", name: "Marketing" },
  {
    id: "finance",
    path: "/jobs?category=finance",
    name: "Finance & Accounting",
  },
  { id: "hr", path: "/jobs?category=hr", name: "Human Resources" },
];

// Helper function to check if the menu item should be shown for the user's role
export const shouldShowMenuItem = (
  item: MenuItem,
  userRole?: string
): boolean => {
  if (!item.role) return true;
  if (Array.isArray(item.role))
    return userRole ? item.role.includes(userRole) : false;
  return item.role === userRole;
};

// Get menu items based on user role
export const getMenuItemsByRole = (role?: string): MenuItem[] => {
  if (role === "admin") return ADMIN_MENU_ITEMS;
  if (role === "company" || role === "hr") return COMPANY_MENU_ITEMS;
  return USER_MENU_ITEMS;
};

// Get dashboard path based on user role
export const getDashboardPath = (role?: string): string => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "company" || role === "hr") return "/management";
  return "/dashboard/user";
};
