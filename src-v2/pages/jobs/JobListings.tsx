import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { JobFilters, JobCard } from "../../features/jobs/components";
import { Card, Button } from "../../components/common";
import { useJobs, useSavedJob } from "../../hooks";
import {
  JobType as JobTypeEnum,
  ExperienceLevel,
  JobWithReferences,
} from "../../types/job.types";

const JobListings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    fetchJobs,
    jobs: jobsData,
    updateFilters,
    resetFilters,
    pagination,
    loading: { jobs: jobsLoading },
  } = useJobs();

  const { savedJobs, fetchSavedJobs, saveJob, unsaveJob } = useSavedJob();

  // Local filters state that will be passed to the API
  const [localFilters, setLocalFilters] = useState({
    search: "",
    location: "",
    jobType: "",
    salary: "",
    datePosted: "",
    experience: "",
  });

  // Parse URL parameters on component mount
  useEffect(() => {
    const query = new URLSearchParams(location.search);

    // Extract search parameters
    const searchParam = query.get("search") || "";
    const locationParam = query.get("location") || "";
    const categoryParam = query.get("category") || "";
    const jobTypeParam = query.get("jobType") || "";

    // Update local filters
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      search: searchParam,
      location: locationParam,
      jobType: jobTypeParam,
    }));

    // Update redux filters and fetch jobs
    updateFilters({
      search: searchParam,
      location: locationParam ? [locationParam] : [],
      category: categoryParam ? [categoryParam] : [],
      jobType: jobTypeParam ? [jobTypeParam as JobTypeEnum] : [],
    });

    // Fetch jobs with these filters
    fetchJobs(1, 10);

    // Fetch saved jobs if needed for comparison
    fetchSavedJobs();
  }, [location.search, updateFilters]);

  // Check if a job is saved
  const isJobSaved = (jobId: string) => {
    return savedJobs.some(
      (savedJob: { _id: string }) => savedJob._id === jobId
    );
  };

  // Handle filter changes in the UI
  const handleFilterChange = (name: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setLocalFilters({
      search: "",
      location: "",
      jobType: "",
      salary: "",
      datePosted: "",
      experience: "",
    });
    resetFilters();

    // Clear URL parameters and reload jobs
    navigate("/jobs");
    fetchJobs(1, 10);
  };

  // Apply filters
  const handleApplyFilters = () => {
    // Convert local filters to redux filter format
    const newFilters = {
      search: localFilters.search,
      location: localFilters.location ? [localFilters.location] : [],
      jobType: localFilters.jobType
        ? [localFilters.jobType as JobTypeEnum]
        : [],
      experienceLevel: localFilters.experience
        ? [localFilters.experience as ExperienceLevel]
        : [],
    };

    updateFilters(newFilters);

    // Update URL to reflect filters
    const searchParams = new URLSearchParams();
    if (localFilters.search) searchParams.set("search", localFilters.search);
    if (localFilters.location)
      searchParams.set("location", localFilters.location);
    if (localFilters.jobType) searchParams.set("jobType", localFilters.jobType);
    if (localFilters.experience)
      searchParams.set("experience", localFilters.experience);

    navigate({
      pathname: "/jobs",
      search: searchParams.toString(),
    });

    // Fetch jobs with new filters
    fetchJobs(1, 10);
  };

  // Toggle saved job
  const handleToggleSaveJob = async (jobId: string) => {
    if (isJobSaved(jobId)) {
      await unsaveJob(jobId);
    } else {
      await saveJob(jobId);
    }
  };

  // Map job data to JobCard props
  const mapJobToCardProps = (job: JobWithReferences) => {
    return {
      id: job._id,
      title: job.title,
      company: job.companyName || "Company Name",
      companyLogo: job.logoCompany,
      location: job.location,
      jobType: job.jobType,
      salary: job.salaryRange
        ? {
            min: parseInt(job.salaryRange.split("-")[0]) || 0,
            max: parseInt(job.salaryRange.split("-")[1]) || 0,
            currency: job.salaryCurrency || "$",
          }
        : undefined,
      skills: job.skillDetails?.map((skill) => skill.name) || [],
      postedDate: job.createdAt.toString(),
      deadline: job.deadline?.toString(),
      isSaved: isJobSaved(job._id),
      onSave: () => handleToggleSaveJob(job._id),
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Find Your Dream Job</h1>

      {/* Filters */}
      <JobFilters
        filters={localFilters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        onSubmit={handleApplyFilters}
      />

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {!jobsLoading ? (
            <>
              Showing{" "}
              <span className="font-medium">{jobsData.length || 0}</span> of{" "}
              <span className="font-medium">{pagination.totalJobs || 0}</span>{" "}
              jobs
            </>
          ) : (
            "Loading jobs..."
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Sort by: Newest
          </Button>
        </div>
      </div>

      {/* Job cards */}
      {jobsLoading ? (
        // Loading state
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Card
                key={index}
                variant="outlined"
                className="p-4 animate-pulse"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      ) : jobsData && jobsData.length > 0 ? (
        <div className="space-y-4">
          {jobsData.map((job: JobWithReferences) => (
            <JobCard key={job._id} {...mapJobToCardProps(job)} />
          ))}

          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <Button
                    key={page}
                    variant={
                      page === pagination.currentPage ? "primary" : "outline"
                    }
                    size="sm"
                    onClick={() => fetchJobs(page, 10)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // No results
        <Card className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search filters or browse all jobs
          </p>
          <Button
            variant="primary"
            onClick={() => {
              handleResetFilters();
              fetchJobs(1, 10);
            }}
          >
            View All Jobs
          </Button>
        </Card>
      )}
    </div>
  );
};

export default JobListings;
