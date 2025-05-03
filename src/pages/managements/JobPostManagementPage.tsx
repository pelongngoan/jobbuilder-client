import React, { useState } from "react";
import {
  Plus,
  Search,
  Grid,
  List,
  ExternalLink,
  Edit,
  Trash2,
  MapPin,
  Award,
  DollarSign,
  Clock,
  X,
} from "lucide-react";
import { PostJob } from "../PostJob";
import { DataTable, TablePagination } from "../../components/DataTable";

// Define types
interface JobPost {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  status: "Active" | "Draft" | "Closed";
  applications: number;
  postedDate: string;
  salary: string;
  skills: string[];
  hrManager: string;
}

interface TableColumn {
  key: keyof JobPost | "actions";
  header: string;
  align?: "left" | "right";
  render: (job: JobPost) => React.ReactNode;
}

// Mock data for job posts
const initialJobPosts: JobPost[] = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    status: "Active",
    applications: 27,
    postedDate: "Apr 12, 2025",
    salary: "$90,000 - $120,000",
    skills: ["React", "TypeScript", "CSS"],
    hrManager: "Sarah Johnson",
  },
  {
    id: 2,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    status: "Active",
    applications: 19,
    postedDate: "Apr 15, 2025",
    salary: "$85,000 - $110,000",
    skills: ["Figma", "User Research", "Prototyping"],
    hrManager: "Mike Chen",
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    status: "Active",
    applications: 23,
    postedDate: "Apr 10, 2025",
    salary: "$110,000 - $140,000",
    skills: ["Product Strategy", "Agile", "Roadmapping"],
    hrManager: "Priya Patel",
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Austin, TX",
    type: "Full-time",
    status: "Draft",
    applications: 0,
    postedDate: "N/A",
    salary: "$100,000 - $130,000",
    skills: ["AWS", "Docker", "CI/CD"],
    hrManager: "Lisa Taylor",
  },
  {
    id: 5,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Chicago, IL",
    type: "Full-time",
    status: "Closed",
    applications: 32,
    postedDate: "Mar 5, 2025",
    salary: "$70,000 - $90,000",
    skills: ["Content Marketing", "SEO", "Social Media"],
    hrManager: "David Kim",
  },
  {
    id: 6,
    title: "Backend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Contract",
    status: "Active",
    applications: 15,
    postedDate: "Apr 18, 2025",
    salary: "$90/hour",
    skills: ["Node.js", "MongoDB", "Express"],
    hrManager: "Sarah Johnson",
  },
];

// Dialog component for job post creation/editing
const JobPostDialog = ({ isOpen, onClose, jobPost = null }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        {/* Dialog content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <PostJob />
        </div>
      </div>
    </div>
  );
};

export const JobPostManagementPage: React.FC = () => {
  const [jobPosts, setJobPosts] = useState<JobPost[]>(initialJobPosts);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [currentJobPost, setCurrentJobPost] = useState<JobPost | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;

  // Filter job posts based on search term and filters
  const filteredJobPosts: JobPost[] = jobPosts.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      job.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesDepartment =
      departmentFilter === "all" || job.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get unique departments for filter dropdown
  const departments: string[] = [
    ...new Set(jobPosts.map((job) => job.department)),
  ];

  const handleCreateJobPost = (): void => {
    setCurrentJobPost(null);
    setDialogOpen(true);
  };

  const handleEditJobPost = (jobPost: JobPost): void => {
    setCurrentJobPost(jobPost);
    setDialogOpen(true);
  };

  const closeDialog = (): void => {
    setDialogOpen(false);
    setCurrentJobPost(null);
  };

  // Define columns for list view table
  const tableColumns: TableColumn[] = [
    {
      key: "title",
      header: "Job Title",
      render: (job) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{job.title}</div>
          <div className="text-xs text-gray-500">{job.type}</div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (job) => (
        <span className="text-sm text-gray-500">{job.department}</span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (job) => (
        <span className="text-sm text-gray-500">{job.location}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (job) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            job.status === "Active"
              ? "bg-green-100 text-green-800"
              : job.status === "Draft"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {job.status}
        </span>
      ),
    },
    {
      key: "applications",
      header: "Applications",
      render: (job) => (
        <span className="text-sm text-gray-500">{job.applications}</span>
      ),
    },
    {
      key: "postedDate",
      header: "Posted Date",
      render: (job) => (
        <span className="text-sm text-gray-500">{job.postedDate}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (job) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleEditJobPost(job);
            }}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="p-1 text-red-600 hover:bg-red-100 rounded-full"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Posts</h1>
        <button
          onClick={handleCreateJobPost}
          className="bg-blue-600 text-white flex items-center px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Job Post
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <select
              className="border rounded p-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <select
              className="border rounded p-2 text-sm"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex border rounded">
            <button
              className={`p-2 ${
                viewMode === "grid" ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              className={`p-2 ${
                viewMode === "list" ? "bg-blue-50 text-blue-600" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Job posts display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobPosts.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md cursor-pointer"
              onClick={() => handleEditJobPost(job)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      job.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : job.status === "Draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>

                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Award className="h-4 w-4 mr-1" />
                  {job.department} · {job.type}
                </div>

                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {job.salary}
                </div>

                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Posted: {job.postedDate}
                </div>

                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">
                    Required Skills:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-sm font-medium">
                      {job.applications}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      Applications
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditJobPost(job);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredJobPosts.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                No job posts found matching your filters.
              </p>
            </div>
          )}
        </div>
      ) : (
        <DataTable<JobPost>
          columns={tableColumns}
          data={filteredJobPosts}
          onRowClick={handleEditJobPost}
          emptyMessage="No job posts found matching your filters."
        />
      )}

      {/* Pagination */}
      <TablePagination
        totalItems={filteredJobPosts.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Job Post Dialog */}
      <JobPostDialog
        isOpen={dialogOpen}
        onClose={closeDialog}
        jobPost={currentJobPost}
      />
    </div>
  );
};
