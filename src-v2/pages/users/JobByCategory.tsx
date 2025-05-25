import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useJobs } from "../../hooks/useJobs";
import JobCard from "./JobCard";
import { useTranslation } from "react-i18next";

const JobByCategory: React.FC = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const { jobs, getCategoryJobs } = useJobs();

  useEffect(() => {
    if (categoryId) {
      getCategoryJobs(categoryId);
    }
  }, [categoryId]);

  return (
    <div className="container mx-auto px-4 py-8">
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">{t("jobByCategory.noJobsInCategory")}</p>
        </div>
      )}
    </div>
  );
};

export default JobByCategory;
