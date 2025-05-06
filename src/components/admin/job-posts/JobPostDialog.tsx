import React from "react";
import { PostJob } from "../../../pages/PostJob";
import { JobPost } from "../../../pages/managements/JobCard";

interface JobPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobPost?: JobPost | null;
}

const JobPostDialog: React.FC<JobPostDialogProps> = ({
  isOpen,
  onClose,
  jobPost = null,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        {/* Dialog content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <PostJob jobToEdit={jobPost} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default JobPostDialog;
