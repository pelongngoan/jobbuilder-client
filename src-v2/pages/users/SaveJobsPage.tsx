import { useSaveJob } from "../../hooks/useSaveJob";
import JobCard from "./JobCard";
import { useTranslation } from "react-i18next";

export const SaveJobsPage = () => {
  const { t } = useTranslation();
  const { savedJobs } = useSaveJob();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("dashboard.savedJobs")}
          </h1>
          <p className="text-gray-600">
            {savedJobs.length}{" "}
            {savedJobs.length === 1
              ? t("jobCard.applicant")
              : t("jobCard.applicants")}{" "}
            {t("common.save").toLowerCase()}d
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.5a9 9 0 0118 0"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t("homepage.noJobsTitle")}
            </h3>
            <p className="text-gray-500">{t("homepage.noJobsDescription")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div
                key={job.jobId._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <JobCard job={job.jobId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
