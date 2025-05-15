import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useAuth,
  useJobs,
  useSavedJob,
  useApplication,
  useLoading,
} from "../../hooks";
import { Button, Card, Badge, Modal } from "../../components/common";
import { JobApplicationForm } from "../../features/jobs/components";
import type { ApplicationFormData } from "../../features/jobs/components/JobApplicationForm";

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Job state
  const { fetchJob, currentJob, fetchRecommendedJobs } = useJobs();
  const { saveJob, unsaveJob, checkIfJobSaved } = useSavedJob();
  const { submitApplication } = useApplication();

  // UI state
  const [isSaved, setIsSaved] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);

  // Loading states
  const isLoadingJob = useLoading("getJob");
  const isSubmittingApplication = useLoading("submitApplication");

  // Fetch job data on mount
  useEffect(() => {
    if (jobId) {
      fetchJob(jobId);
      fetchRecommendedJobs().then((result) => {
        if (result && result.success && result.data) {
          setSimilarJobs(result.data.slice(0, 3));
        }
      });

      // Check if job is saved
      checkIfJobSaved(jobId).then((isSaved) => {
        setIsSaved(isSaved);
      });
    }
  }, [jobId, fetchJob, fetchRecommendedJobs, checkIfJobSaved]);

  // Toggle saved job status
  const handleToggleSave = async () => {
    if (!jobId) return;

    if (isSaved) {
      const result = await unsaveJob(jobId);
      if (result && result.success) {
        setIsSaved(false);
      }
    } else {
      const result = await saveJob(jobId);
      if (result && result.success) {
        setIsSaved(true);
      }
    }
  };

  // Handle application submission
  const handleApplicationSubmit = async (formData: ApplicationFormData) => {
    if (!jobId) return;

    const result = await submitApplication({
      jobId,
      resumeId: formData.resumeId,
      coverLetter: formData.coverLetter,
      phone: formData.phone,
      additionalInfo: formData.additionalInfo,
    });

    if (result && result.success) {
      setIsApplicationModalOpen(false);
      // Show success message or redirect
      alert("Your application has been submitted successfully!");
    }
  };

  // Format salary
  const formattedSalary = currentJob?.salaryRange
    ? `${currentJob.salaryCurrency || "$"}${parseInt(
        currentJob.salaryRange.split("-")[0]
      ).toLocaleString()} - ${currentJob.salaryCurrency || "$"}${parseInt(
        currentJob.salaryRange.split("-")[1]
      ).toLocaleString()}`
    : "Not specified";

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoadingJob) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-40 bg-gray-200 rounded w-full"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Job Not Found</h2>
          <p className="text-gray-500 mb-4">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate("/jobs")}>
            Browse Jobs
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="lg:w-2/3">
          {/* Job header */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6 p-6">
              {/* Company logo */}
              <div className="flex-shrink-0">
                {currentJob.logoCompany ? (
                  <img
                    src={currentJob.logoCompany}
                    alt={`${currentJob.companyName} logo`}
                    className="w-16 h-16 object-contain rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 font-bold text-xl">
                      {currentJob.companyName
                        ? currentJob.companyName.charAt(0)
                        : "C"}
                    </span>
                  </div>
                )}
              </div>

              {/* Job info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentJob.title}
                </h1>
                <p className="text-lg text-gray-700 mb-3">
                  {currentJob.companyName} • {currentJob.location}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="primary" rounded>
                    {currentJob.jobType}
                  </Badge>
                  {currentJob.salaryRange && (
                    <Badge variant="success" rounded>
                      {formattedSalary}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  Posted: {formatDate(currentJob.createdAt.toString())}
                  {currentJob.deadline && (
                    <span className="ml-3">
                      Application Deadline:{" "}
                      {formatDate(currentJob.deadline.toString())}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      isAuthenticated
                        ? setIsApplicationModalOpen(true)
                        : navigate("/login")
                    }
                  >
                    Apply Now
                  </Button>

                  <Button variant="outline" onClick={handleToggleSave}>
                    {isSaved ? "Saved" : "Save Job"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Job description */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Job Description</h2>
              <div
                className="job-description prose max-w-none"
                dangerouslySetInnerHTML={{ __html: currentJob.description }}
              />
            </div>
          </Card>

          {/* Key responsibilities */}
          {currentJob.keyResponsibilities &&
            currentJob.keyResponsibilities.length > 0 && (
              <Card className="mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Key Responsibilities
                  </h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {currentJob.keyResponsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

          {/* Requirements */}
          {currentJob.requirements && currentJob.requirements.length > 0 && (
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {currentJob.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {/* Benefits */}
          {currentJob.benefits && currentJob.benefits.length > 0 && (
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Benefits</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {currentJob.benefits.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Company info */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Company Information</h2>
              <div className="flex items-center mb-4">
                {currentJob.logoCompany ? (
                  <img
                    src={currentJob.logoCompany}
                    alt={`${currentJob.companyName} logo`}
                    className="w-12 h-12 mr-3 object-contain rounded"
                  />
                ) : (
                  <div className="w-12 h-12 mr-3 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 font-bold text-lg">
                      {currentJob.companyName
                        ? currentJob.companyName.charAt(0)
                        : "C"}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold">
                  {currentJob.companyName}
                </h3>
              </div>

              {currentJob.companyWebsite && (
                <p className="mb-2">
                  <span className="font-medium">Website:</span>{" "}
                  <a
                    href={currentJob.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {currentJob.companyWebsite}
                  </a>
                </p>
              )}
            </div>
          </Card>

          {/* Skills */}
          {currentJob.skillDetails && currentJob.skillDetails.length > 0 && (
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {currentJob.skillDetails.map((skill) => (
                    <Badge key={skill._id.toString()} variant="primary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Similar jobs */}
          {similarJobs.length > 0 && (
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Similar Jobs</h2>
                <div className="space-y-4">
                  {similarJobs.map((job) => (
                    <div
                      key={job._id}
                      className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                    >
                      <h3 className="font-medium mb-1">
                        <a
                          href={`/jobs/${job._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {job.title}
                        </a>
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {job.companyName} • {job.location}
                      </p>
                      <div className="flex gap-2 mb-1">
                        <Badge variant="light" size="sm">
                          {job.jobType}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Posted: {formatDate(job.createdAt.toString())}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Application modal */}
      <Modal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        title="Apply for this job"
      >
        <JobApplicationForm
          jobId={jobId || ""}
          jobTitle={currentJob.title}
          companyName={currentJob.companyName || ""}
          onSubmit={handleApplicationSubmit}
          isSubmitting={isSubmittingApplication}
        />
      </Modal>
    </div>
  );
};

export default JobDetails;
