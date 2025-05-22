import React from "react";
import { useJobs } from "../../hooks/useJobs";
import Card from "../common/Card";
import Button from "../common/Button";
import { Business, LocationOn, AccessTime } from "@mui/icons-material";
import { JobPost } from "../../types/job.types";

interface LatestJobsProps {
  onJobClick: (jobId: string) => void;
}

export const LatestJobs: React.FC<LatestJobsProps> = ({ onJobClick }) => {
  const { jobs } = useJobs();

  const formatDate = (date: Date) => {
    const postedDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const formatSalary = (from: number, to: number, currency: string) => {
    return `${currency}${from.toLocaleString()} - ${currency}${to.toLocaleString()}/year`;
  };

  return (
    <div className="py-16">
      <h2 className="text-3xl font-bold text-center mb-8">
        Latest Job Opportunities
      </h2>
      <div className="space-y-4">
        {jobs.map((job: JobPost) => (
          <Card
            key={job.slug}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center">
                    <Business className="w-5 h-5 mr-2" />
                    <span>{job.companyId.companyName}</span>
                  </div>
                  <div className="flex items-center">
                    <LocationOn className="w-5 h-5 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <AccessTime className="w-5 h-5 mr-2" />
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 flex items-center space-x-4">
                <span className="text-green-600 font-semibold">
                  {formatSalary(
                    job.salaryFrom,
                    job.salaryTo,
                    job.salaryCurrency
                  )}
                </span>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onJobClick(job.slug)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
