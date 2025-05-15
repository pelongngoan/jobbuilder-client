import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import { Card } from "../../components/common";
import { JobApplicationForm } from "../../features/jobs/components";
import useApiCall from "../../hooks/useApiCall";
import applicationService from "../../services/applicationService";

const JobApplicationPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { fetchJob, currentJob } = useJobs();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submitApplicationApi = useApiCall("submitApplication");

  useEffect(() => {
    if (jobId) {
      fetchJob(jobId);
    }
  }, [jobId, fetchJob]);

  const handleSubmitApplication = async (formData: FormData) => {
    if (!jobId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await submitApplicationApi.execute(async () => {
        const response = await applicationService.applyToJob(jobId, formData);
        if (response.success) {
          navigate(`/dashboard/applications?success=true`);
        }
        return response;
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentJob) {
    return <div className="p-4">Loading job details...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Apply for Job</h1>

      <Card className="mb-6 p-4">
        <h2 className="text-xl font-semibold mb-2">{currentJob.title}</h2>
        <p className="text-gray-700 mb-2">{currentJob.company?.name}</p>
        <p className="text-gray-500 mb-4">{currentJob.location}</p>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-semibold mb-2">Job Overview</h3>
          <p className="text-gray-700 mb-4">{currentJob.description}</p>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Application Form</h3>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <JobApplicationForm
          jobId={jobId || ""}
          onSubmit={handleSubmitApplication}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
};

export default JobApplicationPage;
