import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Grid,
  List,
  ExternalLink,
  Edit,
  Trash2,
  Upload,
  Download,
} from "lucide-react";
import { PostJob } from "../PostJob";
import { DataTable, TablePagination } from "../../components/DataTable";
import { getAllJobs, uploadJobsFromCSV } from "../../lib/api/services/jobs";
import { ImportCSVDialog } from "./ImportCSVDialog";
import { downloadCSVTemplate } from "./csv-helpers";
import { JobCard, JobPost } from "./JobCard";

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
          <PostJob jobToEdit={jobPost} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

interface TableColumn {
  key: keyof JobPost | "actions";
  header: string;
  align?: "left" | "right";
  render: (job: JobPost) => React.ReactNode;
}

export const JobPostManagementPage: React.FC = () => {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [currentJobPost, setCurrentJobPost] = useState<JobPost | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
  } | null>(null);
  const itemsPerPage: number = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        console.log("Job posts fetched successfully:", response);
        setJobPosts(response.jobs as JobPost[]);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Filter job posts based on search term and filters
  const filteredJobPosts: JobPost[] = jobPosts?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      job.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesCategory =
      categoryFilter === "all" || job.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories: string[] = [
    ...new Set(jobPosts?.map((job) => job.category)),
  ];

  const handleCreateJobPost = (): void => {
    setCurrentJobPost(null);
    setDialogOpen(true);
  };

  const handleEditJobPost = (jobPost: JobPost): void => {
    setCurrentJobPost(jobPost);
    setDialogOpen(true);
  };

  const handleDownloadCSVTemplate = (): void => {
    downloadCSVTemplate();
  };

  const handleOpenImportDialog = (): void => {
    setImportDialogOpen(true);
  };

  const handleImportComplete = async (
    jobPosts: Partial<JobPost>[],
    file: File
  ): Promise<void> => {
    setIsImporting(true);
    setImportResults(null);

    try {
      // Get company ID and HR ID - from context/state or local storage
      // For this example we're using placeholder values
      const companyId =
        localStorage.getItem("companyId") || "6634b95c8dbf4d5a3a4e5f12";
      const hrId = localStorage.getItem("hrId") || "6634b9608dbf4d5a3a4e5f13";

      // Call the API to upload jobs from CSV
      const response = await uploadJobsFromCSV(file, companyId, hrId);

      // Handle response from the API
      // Adjust this based on your actual API response structure
      const successCount =
        response.successCount || response.data?.successCount || jobPosts.length;
      const failedCount =
        response.failedCount || response.data?.failedCount || 0;

      setImportResults({ success: successCount, failed: failedCount });

      // Refresh the job list after successful import
      try {
        const jobsResponse = await getAllJobs();
        setJobPosts(jobsResponse.jobs as JobPost[]);
      } catch (error) {
        console.error("Error fetching jobs after import:", error);
      }
    } catch (error) {
      console.error("Error importing jobs from CSV:", error);
      // If there's an error with the API call, consider all jobs failed
      setImportResults({ success: 0, failed: jobPosts.length });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteJobPost = (id: string): void => {
    // Implement deletion logic here
    console.log("Delete job post with ID:", id);
    // After deletion, refresh the job list
    // You could add a confirmation dialog here
  };

  const handleViewJobPost = (jobPost: JobPost): void => {
    // Implement view logic here
    console.log("View job post:", jobPost);
    // Could navigate to a detailed view page or open a modal
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
          <div className="text-xs text-gray-500">{job.companyName}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Department",
      render: (job) => (
        <span className="text-sm text-gray-500">{job.category}</span>
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
      key: "jobType",
      header: "Type",
      render: (job) => (
        <span className="text-sm text-gray-500">{job.jobType}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (job) => {
        const statusStyle =
          job.status.toLowerCase() === "open"
            ? "bg-green-100 text-green-800"
            : job.status.toLowerCase() === "draft"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-gray-100 text-gray-800";

        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyle}`}
          >
            {job.status}
          </span>
        );
      },
    },
    {
      key: "applications",
      header: "Applications",
      render: (job) => (
        <span className="text-sm text-gray-500">{job.applications.length}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Posted Date",
      render: (job) => (
        <span className="text-sm text-gray-500">
          {formatDate(job.createdAt)}
        </span>
      ),
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (job) => (
        <span className="text-sm text-gray-500">
          {formatDate(job.deadline)}
        </span>
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
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleDeleteJobPost(job._id);
            }}
            className="p-1 text-red-600 hover:bg-red-100 rounded-full"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleViewJobPost(job);
            }}
            className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobPosts?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Posts</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadCSVTemplate}
            className="bg-gray-100 text-gray-700 flex items-center px-3 py-2 rounded hover:bg-gray-200"
            title="Download CSV Template"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Template</span>
          </button>
          <button
            onClick={handleOpenImportDialog}
            className="bg-green-600 text-white flex items-center px-3 py-2 rounded hover:bg-green-700"
            title="Import from CSV"
          >
            <Upload className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Import CSV</span>
          </button>
          <button
            onClick={handleCreateJobPost}
            className="bg-blue-600 text-white flex items-center px-4 py-2 rounded hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Create Job Post</span>
          </button>
        </div>
      </div>

      {/* Import results notification */}
      {importResults && (
        <div
          className={`p-4 rounded-md ${
            importResults.failed === 0 ? "bg-green-50" : "bg-yellow-50"
          }`}
        >
          <div className="flex">
            <div
              className={`flex-shrink-0 ${
                importResults.failed === 0
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {importResults.failed === 0 ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3">
              <h3
                className={`text-sm font-medium ${
                  importResults.failed === 0
                    ? "text-green-800"
                    : "text-yellow-800"
                }`}
              >
                Import Complete
              </h3>
              <div
                className={`mt-2 text-sm ${
                  importResults.failed === 0
                    ? "text-green-700"
                    : "text-yellow-700"
                }`}
              >
                <p>
                  Successfully imported {importResults.success} job posts.
                  {importResults.failed > 0 &&
                    ` Failed to import ${importResults.failed} job posts.`}
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <button
                    type="button"
                    onClick={() => setImportResults(null)}
                    className={`ml-auto bg-${
                      importResults.failed === 0 ? "green" : "yellow"
                    }-50 px-2 py-1.5 rounded-md text-sm font-medium text-${
                      importResults.failed === 0 ? "green" : "yellow"
                    }-800 hover:bg-${
                      importResults.failed === 0 ? "green" : "yellow"
                    }-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${
                      importResults.failed === 0 ? "green" : "yellow"
                    }-50 focus:ring-${
                      importResults.failed === 0 ? "green" : "yellow"
                    }-600`}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <select
              className="border rounded p-2 text-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
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
          {currentItems && currentItems.length > 0 ? (
            currentItems.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={handleEditJobPost}
                onDelete={handleDeleteJobPost}
                onView={handleViewJobPost}
                viewType="grid"
              />
            ))
          ) : (
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
          data={currentItems || []}
          onRowClick={handleViewJobPost}
          emptyMessage="No job posts found matching your filters."
        />
      )}

      {/* Pagination */}
      <TablePagination
        totalItems={filteredJobPosts?.length || 0}
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

      {/* CSV Import Dialog */}
      <ImportCSVDialog
        isOpen={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onImportComplete={handleImportComplete}
      />

      {/* Loading overlay for import process */}
      {isImporting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-700">Importing job posts...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        </div>
      )}
    </div>
  );
};
