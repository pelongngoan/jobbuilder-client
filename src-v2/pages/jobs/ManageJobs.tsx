import React, { useState, useEffect } from "react";
import { ManagementLayout } from "../../components/layouts";
import {
  ActionButton,
  PlusIcon,
  ViewToggle,
  ViewMode,
  SearchToolbar,
} from "../../components/manager";
import {
  Card,
  DataTable,
  Pagination,
  EmptyState,
  DocumentIcon,
} from "../../components/common";
import { Column } from "../../components/common/DataTable";
import { useNavigate, useLocation } from "react-router-dom";
import useApiCall from "../../hooks/useApiCall";
import jobService from "../../services/jobService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { JobWithReferences } from "../../types";
import PostJobPage from "./PostJobPage";

// Define company type for DataTable
interface CompanyInfo {
  name: string;
  _id?: string;
  logo?: string;
  website?: string;
}

const ManageJobs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [jobs, setJobs] = useState<JobWithReferences[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithReferences[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showAddJobForm, setShowAddJobForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // API calls
  const getJobsApi = useApiCall("getJobs");
  const deleteJobApi = useApiCall("deleteJob");

  // Loading state
  const loading = useSelector(
    (state: RootState) => state.loading["getJobs"] || state.loading["deleteJob"]
  );

  // Check if we should show the create form based on URL
  useEffect(() => {
    if (location.pathname.endsWith("/create")) {
      setShowAddJobForm(true);
    } else {
      setShowAddJobForm(false);
    }
  }, [location.pathname]);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await jobService.getManagerJobs(
        currentPage,
        itemsPerPage
      );
      if (response.success && response.data) {
        setJobs(response.data.items);
        applyFilters(response.data.items, searchQuery);
      }
      return response;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  };

  // Apply filters and pagination
  const applyFilters = (data: JobWithReferences[], query: string) => {
    let filtered = [...data];

    // Apply search filter
    if (query.trim()) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query.toLowerCase()) ||
          job.description?.toLowerCase().includes(query.toLowerCase()) ||
          job.company?.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Calculate total pages
    setTotalPages(Math.max(1, Math.ceil(filtered.length / itemsPerPage)));

    // Reset to page 1 if current page would be out of bounds
    if (currentPage > Math.ceil(filtered.length / itemsPerPage)) {
      setCurrentPage(1);
    }

    setFilteredJobs(filtered);
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredJobs.slice(startIndex, endIndex);
  };

  // Initial fetch
  useEffect(() => {
    if (!showAddJobForm) {
      fetchJobs();
    }
  }, [currentPage, showAddJobForm]);

  // Apply filters when search changes
  useEffect(() => {
    applyFilters(jobs, searchQuery);
  }, [searchQuery, jobs]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle job actions
  const handleAddJob = () => {
    navigate("create");
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/management/jobs/edit/${jobId}`);
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/management/jobs/${jobId}`);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteJobApi.execute(async () => {
        try {
          const response = await jobService.deleteJob(jobId);
          if (response.success) {
            fetchJobs();
          }
          return response;
        } catch (error) {
          console.error("Error deleting job:", error);
          throw error;
        }
      });
    }
  };

  // Table columns
  const columns: Column<Record<string, unknown>>[] = [
    {
      id: "title",
      header: "Job Title",
      accessor: (job) => job.title as string,
    },
    {
      id: "company",
      header: "Company",
      accessor: (job) => (job.company as CompanyInfo)?.name || "Unknown",
    },
    {
      id: "location",
      header: "Location",
      accessor: (job) => (job.location as string) || "Remote",
    },
    {
      id: "status",
      header: "Status",
      accessor: (job) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            job.status === "open"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {job.status === "open" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (job) => (
        <div className="flex gap-2">
          <ActionButton
            label="View"
            variant="outline"
            size="sm"
            onClick={() => handleViewJob(job._id as string)}
          />
          <ActionButton
            label="Edit"
            variant="outline"
            size="sm"
            onClick={() => handleEditJob(job._id as string)}
          />
          <ActionButton
            label="Delete"
            variant="danger"
            size="sm"
            onClick={() => handleDeleteJob(job._id as string)}
          />
        </div>
      ),
    },
  ];

  // Action buttons for the page
  const actionButtons = showAddJobForm ? (
    <ActionButton
      label="Back to Jobs"
      variant="outline"
      onClick={() => {
        navigate("/management/jobs");
        setShowAddJobForm(false);
      }}
    />
  ) : (
    <>
      <ActionButton
        label="Add Job"
        icon={<PlusIcon />}
        variant="primary"
        onClick={handleAddJob}
      />
      <ViewToggle currentView={viewMode} onToggle={setViewMode} />
    </>
  );

  // Search toolbar
  const searchToolbar = !showAddJobForm && (
    <SearchToolbar
      onSearch={handleSearch}
      placeholder="Search jobs by title, description, or company..."
      initialQuery={searchQuery}
      isLoading={loading}
    />
  );

  return (
    <ManagementLayout
      title={showAddJobForm ? "Post a New Job" : "Manage Jobs"}
      subtitle={
        showAddJobForm
          ? "Create a new job posting for your company"
          : "Create, edit, and manage job postings"
      }
      actions={actionButtons}
      toolbar={searchToolbar}
      loading={loading && !showAddJobForm}
      error={getJobsApi.error}
    >
      {showAddJobForm ? (
        <PostJobPage />
      ) : filteredJobs.length === 0 && !loading ? (
        <EmptyState
          title="No jobs found"
          description="Try adjusting your search or create a new job"
          icon={<DocumentIcon />}
          action={{
            label: "Add Job",
            onClick: handleAddJob,
          }}
        />
      ) : viewMode === "table" ? (
        <>
          <DataTable
            columns={columns}
            data={getPaginatedData() as unknown as Record<string, unknown>[]}
            keyExtractor={(item) => item._id as string}
            onRowClick={(item) => handleViewJob(item._id as string)}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPaginatedData().map((job) => (
              <Card
                key={job._id}
                className="p-4 hover:shadow-md cursor-pointer"
              >
                <div onClick={() => handleViewJob(job._id)}>
                  <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                  <p className="text-gray-600 mb-2">{job.company?.name}</p>
                  <p className="text-gray-500 mb-3">
                    {job.location || "Remote"}
                  </p>

                  <div className="flex justify-between items-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        job.status === "open"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {job.status === "open" ? "Active" : "Inactive"}
                    </span>

                    <div className="flex gap-2">
                      <ActionButton
                        label="Edit"
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditJob(job._id)}
                      />
                      <ActionButton
                        label="Delete"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteJob(job._id)}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </ManagementLayout>
  );
};

export default ManageJobs;
