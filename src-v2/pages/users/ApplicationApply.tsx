import { useState, useEffect } from "react";
import { Modal } from "../../components/common";
import { useApplication } from "../../hooks/useApplication";
import { useJobs } from "../../hooks/useJobs";
import { useResume } from "../../hooks/useResume";
import { useTranslation } from "react-i18next";
import useNotification from "../../hooks/useNotification";
import { useUser } from "../../hooks/useUser";
interface ApplicationApplyProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Resume radio selection component
 */
const ResumeRadioCheck = ({
  resumes,
  selectedId,
  setSelectedId,
}: {
  resumes: any[];
  selectedId: string | null;
  setSelectedId: (id: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      {resumes.map((resume: any) => (
        <div
          key={resume._id}
          className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
            selectedId === resume._id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200"
          }`}
          onClick={() => setSelectedId(resume._id)}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="resume"
              id={`resume-${resume._id}`}
              checked={selectedId === resume._id}
              onChange={() => setSelectedId(resume._id)}
              className="h-4 w-4 text-blue-600"
            />
            <div className="flex flex-col">
              <label
                htmlFor={`resume-${resume._id}`}
                className="font-medium text-gray-900 cursor-pointer"
              >
                {resume.title}
              </label>
              {resume.description && (
                <span className="text-sm text-gray-500">
                  {resume.description}
                </span>
              )}
              <span className="text-xs text-gray-400">
                {t("applicationApply.lastUpdated", {
                  date: new Date(resume.updatedAt).toLocaleDateString(),
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ApplicationApply = ({
  isOpen,
  onClose,
}: ApplicationApplyProps) => {
  const { t } = useTranslation();
  const { applyForJob } = useApplication();
  const { currentJob } = useJobs();
  const { resumes, fetchResumes } = useResume();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (currentJob) {
      fetchResumes();
    }
  }, [currentJob, fetchResumes]);

  useEffect(() => {
    // Set the first resume as selected by default when resumes load
    if (resumes.length > 0 && !selectedId) {
      setSelectedId(resumes[0]._id);
    }
  }, [resumes, selectedId]);

  const { createNotification } = useNotification();
  const { profile } = useUser();
  const handleApply = async () => {
    if (!selectedId || !currentJob?._id) return;
    setIsSubmitting(true);
    try {
      await applyForJob(currentJob._id, selectedId);
      createNotification({
        userId: currentJob?.contacterId?._id as string,
        type: "job_application",
        content: `${profile?.userId.email} applied for ${currentJob?.title}`,
      });
      onClose();
    } catch (error) {
      console.error("Failed to apply for job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("applicationApply.applyForJob")}
    >
      <div className="flex flex-col gap-4">
        {resumes.length > 0 ? (
          <>
            <p className="text-gray-700">
              {t("applicationApply.selectResume")}
            </p>
            <ResumeRadioCheck
              resumes={resumes}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleApply}
                disabled={!selectedId || isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? t("applicationApply.applying")
                  : t("jobs.applyNow")}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">
              {t("applicationApply.noResumesMessage")}
            </p>
            <button
              onClick={onClose}
              className="mt-3 text-blue-600 hover:underline"
            >
              {t("applicationApply.createResumeFirst")}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
