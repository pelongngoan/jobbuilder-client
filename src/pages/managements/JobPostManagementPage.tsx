import React, { useEffect, useState } from "react";
import {
  Plus,
  Grid,
  List,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { DataTable, TablePagination } from "../../components/DataTable";
import { uploadJobsFromCSV } from "../../lib/api/services/jobs";
import { ImportCSVDialog } from "./ImportCSVDialog";
import { downloadCSVTemplate } from "./csv-helpers";
import { JobCard } from "./JobCard";
import JobPostDialog from "../../components/admin/job-posts/JobPostDialog";
import SearchInput, {
  SearchFilterState,
} from "../../components/shared/SearchInput";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobs,
  deleteJob as deleteJobThunk,
} from "../../store/jobs/jobsSlice";
import type { RootState, AppDispatch } from "../../store";
import { JobPost } from "../../types/job";
import { getJobPostTableColumns } from "../../components/admin/job-posts/jobPostTableColumns";

export const JobPostManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const [filters, setFilters] = useState<SearchFilterState>({
    search: "",
    status: "all",
    category: "all",
  });
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
    dispatch(
      fetchJobs({
        page: currentPage,
        limit: itemsPerPage,
        title: filters.search || undefined,
      })
    );
  }, [filters, currentPage, dispatch]);

  useEffect(() => {
    dispatch(
      fetchJobs({
        page: currentPage,
        limit: itemsPerPage,
        title: filters.search || undefined,
      })
    );
  }, [filters, currentPage, dispatch]);

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
      dispatch(
        fetchJobs({
          page: currentPage,
          limit: itemsPerPage,
          title: filters.search || undefined,
        })
      );
    } catch (error) {
      console.error("Error importing jobs from CSV:", error);
      // If there's an error with the API call, consider all jobs failed
      setImportResults({ success: 0, failed: jobPosts.length });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDeleteJobPost = async (id: string): Promise<void> => {
    try {
      await dispatch(deleteJobThunk(id));
      // Optionally, show a success notification here
    } catch (error) {
      console.error("Error deleting job post:", error);
      // Optionally, show an error notification here
    }
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
  const tableColumns = getJobPostTableColumns(
    handleEditJobPost,
    handleDeleteJobPost,
    handleViewJobPost
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = jobs?.slice(indexOfFirstItem, indexOfLastItem);

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
          <SearchInput
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            onSearch={(value) => setFilters((f) => ({ ...f, search: value }))}
            placeholder="Search jobs..."
          />
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <select
              className="border rounded p-2 text-sm"
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* <div>
            <select
              className="border rounded p-2 text-sm"
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
            >
              <option value="all">All Departments</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div> */}

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
                job={job as unknown as JobPost}
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
          data={(currentItems as unknown as JobPost[]) || []}
          onRowClick={handleViewJobPost}
          emptyMessage="No job posts found matching your filters."
        />
      )}

      {/* Pagination */}
      <TablePagination
        totalItems={jobs?.length || 0}
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
