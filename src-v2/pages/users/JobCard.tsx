import { useState } from "react";
import { Clock, MapPin, ChevronRight, Star, Building } from "lucide-react";
import { JobPost } from "../../types/job.types";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "./CompanyCard";
import { useSaveJob } from "../../hooks/useSaveJob";
import { useAppDispatch } from "../../redux/store";
import { setCurrentJob } from "../../redux/slices/jobsSlice";
import { useTranslation } from "react-i18next";

export default function JobCard({ job }: { job: JobPost }) {
  const { t } = useTranslation();
  const { savedJobs, saveJob, deleteSavedJob } = useSaveJob();
  const dispatch = useAppDispatch();
  const [isSaved, setIsSaved] = useState(
    savedJobs.some((item) => item.jobId._id == job._id)
  );

  // Format salary range
  const formatSalary = () => {
    if (!job.salaryFrom && !job.salaryTo) return t("jobCard.negotiable");

    const currency = job.salaryCurrency || "";
    const from = job.salaryFrom
      ? new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
          job.salaryFrom
        )
      : "";
    const to = job.salaryTo
      ? new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
          job.salaryTo
        )
      : "";

    if (from && to) return `${from} - ${to} ${currency}`;
    if (from) return `${t("jobCard.from")} ${from} ${currency}`;
    if (to) return `${t("jobCard.upTo")} ${to} ${currency}`;
    return t("jobCard.negotiable");
  };

  // Format deadline
  const formatDeadline = () => {
    if (!job.deadline) return null;

    const deadline = new Date(job.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return t("jobCard.expired");
    if (diffDays === 0) return t("jobCard.expiresToday");
    if (diffDays === 1) return t("jobCard.expiresTomorrow");
    return `${t("jobCard.expiresIn")} ${diffDays} ${t(
      "jobCard.expiresInDays"
    )}`;
  };

  // Get badge color class based on job type
  const getJobTypeBadgeClass = () => {
    switch (job.jobType) {
      case "full-time":
        return "bg-green-100 text-green-700 border-green-200";
      case "part-time":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "contract":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "internship":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "remote":
        return "bg-teal-100 text-teal-700 border-teal-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Get translated job type
  const getJobTypeText = () => {
    if (!job.jobType) return t("jobCard.typeUnknown");
    return t(`jobTypes.${job.jobType}`) || job.jobType.replace("-", " ");
  };

  const toggleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isSaved) {
      deleteSavedJob(job._id);
    } else {
      saveJob(job._id);
    }
    setIsSaved(!isSaved);
  };

  const navigate = useNavigate();

  const handleViewDetails = () => {
    dispatch(setCurrentJob(job));
    navigate(`/user/jobs/${job._id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-200 mb-4 group"
      onClick={handleViewDetails}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="bg-gray-50 rounded-lg w-14 h-14 flex items-center justify-center flex-shrink-0 border">
              {job.companyId?.logo ? (
                <img
                  src={getImageUrl(job.companyId.logo)}
                  alt={`${job.companyId.companyName} logo`}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <Building className="text-gray-400" size={20} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2 mb-1">
                <h3 className="font-semibold text-base text-gray-900 line-clamp-2 flex-1">
                  {job.title}
                </h3>
                {job.isFeatured && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                    TOP
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                {job.companyId?.companyName || t("jobCard.companyUnknown")}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  <span>{job.location || t("jobCard.locationUnknown")}</span>
                </div>
                <div className="font-medium text-green-600">
                  {formatSalary()}
                </div>
              </div>
            </div>
          </div>
          <button
            className="text-gray-300 hover:text-green-500 focus:outline-none flex-shrink-0 ml-2 p-1"
            onClick={toggleSave}
            aria-label={isSaved ? t("jobCard.unsaveJob") : t("jobCard.saveJob")}
          >
            <Star
              size={20}
              className={`transition-colors ${
                isSaved ? "fill-green-500 text-green-500" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getJobTypeBadgeClass()}`}
          >
            {getJobTypeText()}
          </span>

          {job.experienceLevel && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              {job.experienceLevel}
            </span>
          )}

          {job.skills &&
            job.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {skill}
              </span>
            ))}

          {job.skills && job.skills.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
              +{job.skills.length - 3}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {job.deadline && (
              <div className="flex items-center">
                <Clock size={12} className="mr-1" />
                <span>{formatDeadline()}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700">
                {job.applicationCount || 0}
              </span>{" "}
              {(job.applicationCount || 0) === 1
                ? t("jobCard.applicant")
                : t("jobCard.applicants")}
            </div>
          </div>

          <div className="text-green-600 flex items-center text-sm font-medium group-hover:text-green-700 transition-colors">
            {t("common.viewDetails")}
            <ChevronRight size={14} className="ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
