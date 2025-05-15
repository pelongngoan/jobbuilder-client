import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSavedJob, useLoading } from "../../hooks";
import { Button, Card } from "../../components/common";
import { JobCard } from "../../features/jobs/components";
import { JobWithReferences } from "../../types/job.types";

const SavedJobsPage: React.FC = () => {
  const { savedJobs, fetchSavedJobs, unsaveJob } = useSavedJob();
  const isLoading = useLoading("getSavedJobs");

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const handleUnsaveJob = async (jobId: string) => {
    await unsaveJob(jobId);
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
      isSaved: true,
      onSave: () => handleUnsaveJob(job._id),
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Saved Jobs</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading saved jobs...</p>
      ) : savedJobs.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500 mb-4">
            You haven't saved any jobs yet. Save jobs to apply to them later.
          </p>
          <Link to="/jobs">
            <Button variant="primary">Browse Jobs</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job: JobWithReferences) => (
            <JobCard key={job._id} {...mapJobToCardProps(job)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
