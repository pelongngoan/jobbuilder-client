import { FileText, Download, Edit, Trash2, Eye } from "lucide-react";

interface ResumeCardProps {
  title: string;
  lastUpdated: string;
  thumbnail?: string;
  id: string;
}

export const ResumeCard = ({
  title,
  lastUpdated,
  thumbnail,
  id,
}: ResumeCardProps) => {
  return (
    <div className="resume-card p-4 mb-4" data-resume-id={id}>
      <div className="flex items-start">
        <div className="w-24 h-32 bg-theme-secondary rounded-md flex items-center justify-center mr-4 overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={`${title} thumbnail`}
              className="w-full h-full object-cover"
            />
          ) : (
            <FileText className="h-12 w-12 text-theme-secondary" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-theme-primary">{title}</h3>
          <p className="text-sm text-theme-secondary">
            Last updated: {lastUpdated}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className="flex items-center text-sm text-accent hover:text-primary-600">
              <Eye size={16} className="mr-1" />
              Preview
            </button>
            <button className="flex items-center text-sm text-accent hover:text-primary-600">
              <Edit size={16} className="mr-1" />
              Edit
            </button>
            <button className="flex items-center text-sm text-accent hover:text-primary-600">
              <Download size={16} className="mr-1" />
              Download
            </button>
            <button className="flex items-center text-sm text-error hover:text-error">
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
