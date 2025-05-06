import { TableColumn } from "../../../types/table";
import { JobPost } from "../../../types/job";
import { Edit, Trash2, ExternalLink } from "lucide-react";
import React from "react";

// Helper to format date
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const getJobPostTableColumns = (
  handleEditJobPost: (job: JobPost) => void,
  handleDeleteJobPost: (id: string) => void,
  handleViewJobPost: (job: JobPost) => void
): TableColumn<JobPost>[] => [
  {
    key: "title",
    header: "Job Title",
    render: (job) => (
      <div>
        <div className="text-sm font-medium text-gray-900">{job.title}</div>
        <div className="text-xs text-gray-500">{job.companyName}</div>
      </div>
    ),
  },
  {
    key: "category",
    header: "Department",
    render: (job) => (
      <span className="text-sm text-gray-500">{job.category}</span>
    ),
  },
  {
    key: "location",
    header: "Location",
    render: (job) => (
      <span className="text-sm text-gray-500">{job.location}</span>
    ),
  },
  {
    key: "jobType",
    header: "Type",
    render: (job) => (
      <span className="text-sm text-gray-500">{job.jobType}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (job) => {
      const statusStyle =
        job.status.toLowerCase() === "open"
          ? "bg-green-100 text-green-800"
          : job.status.toLowerCase() === "draft"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-gray-100 text-gray-800";
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyle}`}
        >
          {job.status}
        </span>
      );
    },
  },
  {
    key: "applications",
    header: "Applications",
    render: (job) => (
      <span className="text-sm text-gray-500">{job.applications.length}</span>
    ),
  },
  {
    key: "createdAt",
    header: "Posted Date",
    render: (job) => (
      <span className="text-sm text-gray-500">{formatDate(job.createdAt)}</span>
    ),
  },
  {
    key: "deadline",
    header: "Deadline",
    render: (job) => (
      <span className="text-sm text-gray-500">{formatDate(job.deadline)}</span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    align: "right",
    render: (job) => (
      <div className="flex justify-end space-x-2">
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleEditJobPost(job);
          }}
          className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleDeleteJobPost(job._id);
          }}
          className="p-1 text-red-600 hover:bg-red-100 rounded-full"
        >
          <Trash2 className="h-5 w-5" />
        </button>
        <button
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleViewJobPost(job);
          }}
          className="p-1 text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <ExternalLink className="h-5 w-5" />
        </button>
      </div>
    ),
  },
];
