import React from "react";
import {
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  Briefcase,
  Calendar,
} from "lucide-react";
import { JobPost } from "../../types/job";

interface JobCardProps {
  job: JobPost;
  onEdit: (job: JobPost) => void;
  onDelete: (id: string) => void;
  onView: (job: JobPost) => void;
  viewType: "grid" | "list";
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onEdit,
  onDelete,
  onView,
  viewType,
}) => {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Get status styling based on status value
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Format salary to display nicely
  const formatSalary = (salary: number, currency: string, type: string) => {
    const currencySymbol = currency === "USD" ? "$" : currency;
    return `${currencySymbol}${salary.toLocaleString()} per ${type.replace(
      "ly",
      ""
    )}`;
  };

  if (viewType === "list") {
    // Return a simple version for list view - will be used in the DataTable
    return null;
  }

  // Grid view card
  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md cursor-pointer"
      onClick={() => onView(job)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${getStatusStyle(
              job.status
            )}`}
          >
            {job.status}
          </span>
        </div>

        <div className="mt-2 text-sm font-medium text-gray-700">
          {job.companyName}
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          {job.location}
        </div>

        <div className="mt-1 flex items-center text-sm text-gray-500">
          <Briefcase className="h-4 w-4 mr-1" />
          {job.category} · {job.jobType}
        </div>

        <div className="mt-1 flex items-center text-sm text-gray-500">
          <DollarSign className="h-4 w-4 mr-1" />
          {job.salaryRange ||
            formatSalary(job.salary, job.salaryCurrency, job.salaryType)}
        </div>

        <div className="mt-1 flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          Posted: {formatDate(job.createdAt)}
        </div>

        <div className="mt-1 flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          Deadline: {formatDate(job.deadline)}
        </div>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-1">Required Skills:</div>
            <div className="flex flex-wrap gap-1">
              {job.requirements.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
              {job.requirements.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{job.requirements.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div>
            <span className="text-sm font-medium">
              {job.applications.length}
            </span>
            <span className="text-sm text-gray-500 ml-1">Applications</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(job);
              }}
              className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(job._id);
              }}
              className="p-1 text-red-600 hover:bg-red-100 rounded"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(job);
              }}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
