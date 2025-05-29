import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  Star,
  Building,
  Clock,
  MessageCircle,
} from "lucide-react";
import { useJobs } from "../../hooks/useJobs";
import { getImageUrl } from "./CompanyCard";
import { ApplicationApply } from "./ApplicationApply";
import { useAppDispatch } from "../../redux/store";
import { setCurrentJob } from "../../redux/slices/jobsSlice";
import { useSaveJob } from "../../hooks/useSaveJob";
import { useTranslation } from "react-i18next";
import { useApplication } from "../../hooks/useApplication";
import useChat from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import useNotification from "../../hooks/useNotification";
import { useUser } from "../../hooks/useUser";
const JobDetails = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentJob, getJobById } = useJobs();
  const { savedJobs, saveJob, deleteSavedJob } = useSaveJob();
  const [isSaved, setIsSaved] = useState(false);
  const { applications } = useApplication();
  const [isApplied, setIsApplied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (jobId) {
      getJobById(jobId);
    }
    if (savedJobs) {
      setIsSaved(savedJobs.some((job) => job.jobId._id == currentJob?._id));
    }
    if (applications) {
      setIsApplied(applications.some((app) => app.jobId._id == jobId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, getJobById, savedJobs, applications]);
  const { createNotification } = useNotification();
  const { profile } = useUser();

  const handleApply = () => {
    dispatch(setCurrentJob(currentJob));
    createNotification({
      userId: currentJob?.contacterId?._id as string,
      type: "job_application",
      content: `${profile?.userId.email} applied for ${currentJob?.title}`,
    });
    setIsOpen(true);
  };
  const toggleSaveJob = () => {
    if (currentJob?._id) {
      if (isSaved) {
        deleteSavedJob(currentJob._id);
      } else {
        saveJob(currentJob._id);
      }
      setIsSaved(!isSaved);
    }
  };
  const { getChatByReceiverId, getChatMessages, createChat, currentChat } =
    useChat();
  const { useProfileId } = useAuth();
  const handleContactThroughChat = async () => {
    if (!currentJob?.contacterId?._id) return;
    const existingChat = await getChatByReceiverId(
      currentJob?.contacterId?._id
    );
    if (existingChat?.success && existingChat.data !== null) {
      await getChatMessages(existingChat.data?._id as string);
    } else {
      await createChat(useProfileId as string, currentJob?.contacterId?._id);
    }
    navigate(`/user/chat`);
  };

  // Format salary range
  const formatSalary = () => {
    if (!currentJob) return t("jobDetails.notSpecified");
    if (!currentJob.salaryFrom && !currentJob.salaryTo)
      return t("jobDetails.salaryNotSpecified");

    const currency = currentJob.salaryCurrency || "$";
    const from = currentJob.salaryFrom
      ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
          currentJob.salaryFrom
        )
      : "";
    const to = currentJob.salaryTo
      ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
          currentJob.salaryTo
        )
      : "";

    if (from && to) return `${currency}${from} - ${currency}${to}`;
    if (from) return `${t("jobCard.from")} ${currency}${from}`;
    if (to) return `${t("jobCard.upTo")} ${currency}${to}`;
    return t("jobDetails.salaryNegotiable");
  };

  // Format deadline with days remaining
  const formatDeadline = () => {
    if (!currentJob || !currentJob.deadline) return null;

    const deadline = new Date(currentJob.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return t("jobCard.expired");
    if (diffDays === 0) return t("jobDetails.closingToday");
    if (diffDays === 1) return t("jobDetails.closingTomorrow");
    return `${diffDays} ${t("jobDetails.daysLeft")}`;
  };

  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get badge color class based on job type
  const getJobTypeBadgeClass = () => {
    switch (currentJob?.jobType) {
      case "full-time":
        return "bg-blue-100 text-blue-800";
      case "part-time":
        return "bg-purple-100 text-purple-800";
      case "contract":
        return "bg-orange-100 text-orange-800";
      case "internship":
        return "bg-green-100 text-green-800";
      case "remote":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get translated job type
  const getJobTypeText = () => {
    if (!currentJob?.jobType) return t("jobDetails.notSpecified");
    return (
      t(`jobTypes.${currentJob.jobType}`) ||
      currentJob.jobType.replace("-", " ")
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Job header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              {currentJob?.isFeatured && (
                <div className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded mb-4">
                  {t("jobDetails.featuredPosition")}
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-gray-100 rounded-lg w-16 h-16 flex items-center justify-center">
                    {currentJob?.companyId?.logo ? (
                      <img
                        src={getImageUrl(currentJob?.companyId?.logo)}
                        alt={`${currentJob?.companyId?.companyName} logo`}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <Building size={32} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentJob?.title}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {currentJob?.companyId?.companyName ||
                        t("jobDetails.companyNameUnavailable")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeBadgeClass()}`}
                      >
                        {getJobTypeText()}
                      </span>

                      {currentJob?.experienceLevel && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {currentJob.experienceLevel} {t("jobDetails.level")}
                        </span>
                      )}

                      {currentJob?.deadline && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {formatDeadline()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={toggleSaveJob}
                    className={`p-2 rounded-full ${
                      isSaved
                        ? "bg-yellow-50 text-yellow-500"
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                    aria-label={
                      savedJobs.some((job) => {
                        return job.jobId._id == currentJob?._id;
                      })
                        ? t("jobDetails.unsaveJobAria")
                        : t("jobDetails.saveJobAria")
                    }
                  >
                    <Star
                      size={20}
                      className={isSaved ? "fill-yellow-500" : ""}
                    />
                  </button>
                </div>
              </div>

              {/* Job quick stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <MapPin size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    {currentJob?.location ||
                      t("jobDetails.locationNotSpecified")}
                  </span>
                </div>

                <div className="flex items-center">
                  <Briefcase size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700 capitalize">
                    {getJobTypeText()}
                  </span>
                </div>

                <div className="flex items-center">
                  <DollarSign size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">{formatSalary()}</span>
                </div>

                <div className="flex items-center">
                  <Clock size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    {t("jobDetails.postedOn")}{" "}
                    {formatDate(currentJob?.createdAt || new Date())}
                  </span>
                </div>
              </div>
            </div>

            {/* Job description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("jobDetails.jobDescription")}
              </h2>
              <div className="prose max-w-none text-gray-700">
                {currentJob?.description}
              </div>
            </div>

            {/* Key responsibilities */}
            {currentJob?.keyResponsibilities &&
              currentJob?.keyResponsibilities.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("jobDetails.keyResponsibilities")}
                  </h2>
                  <ul className="space-y-2">
                    {currentJob?.keyResponsibilities.map(
                      (responsibility: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle
                            size={18}
                            className="text-green-500 mr-2 mt-1 flex-shrink-0"
                          />
                          <span className="text-gray-700">
                            {responsibility}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* Requirements */}
            {currentJob?.requirements &&
              currentJob?.requirements.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {t("jobDetails.requirements")}
                  </h2>
                  <ul className="space-y-2">
                    {currentJob?.requirements.map(
                      (requirement: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle
                            size={18}
                            className="text-blue-500 mr-2 mt-1 flex-shrink-0"
                          />
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

            {/* Skills */}
            {currentJob?.skills && currentJob?.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("jobDetails.requiredSkills")}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {currentJob.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {currentJob?.benefits && currentJob?.benefits.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("jobDetails.benefits")}
                </h2>
                <ul className="space-y-2">
                  {currentJob.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle
                        size={18}
                        className="text-purple-500 mr-2 mt-1 flex-shrink-0"
                      />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Apply now card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("jobDetails.applyForPosition")}
              </h2>

              {currentJob?.deadline && (
                <div className="mb-4 flex items-center text-sm">
                  <Calendar size={16} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    {t("jobDetails.applicationDeadline")}{" "}
                    {formatDate(currentJob?.deadline || new Date())}
                    {formatDeadline() && (
                      <span className="ml-2 text-red-600 font-medium">
                        ({formatDeadline()})
                      </span>
                    )}
                  </span>
                </div>
              )}
              <div>
                <div className="mb-6 flex items-center text-sm">
                  <MessageCircle size={16} className="text-gray-500 mr-2" />
                  <button
                    onClick={handleContactThroughChat}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                    title="Contact through chat"
                  >
                    {currentJob?.contacterEmail}
                  </button>
                </div>
              </div>
              <div className="mb-6 flex items-center text-sm">
                <Users size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-700">
                  {currentJob?.applicationCount || 0}{" "}
                  {t("jobDetails.peopleApplied")}
                </span>
              </div>

              <button
                onClick={handleApply}
                disabled={isApplied}
                className={`w-full ${
                  isApplied
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white py-3 px-4 rounded-md font-medium transition-colors duration-200`}
              >
                {isApplied ? t("jobs.applied") : t("jobs.applyNow")}
              </button>

              <button
                onClick={toggleSaveJob}
                className="w-full mt-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-md font-medium flex justify-center items-center transition-colors duration-200"
              >
                <Star
                  size={18}
                  className={`mr-2 ${
                    isSaved ? "fill-yellow-500 text-yellow-500" : ""
                  }`}
                />
                {isSaved ? t("jobDetails.saved") : t("jobs.saveJob")}
              </button>
            </div>

            {/* Company info card */}
            {currentJob?.companyId && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t("jobDetails.aboutCompany")}
                </h2>

                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 rounded-lg w-12 h-12 flex items-center justify-center mr-3">
                    {currentJob?.companyId.logo ? (
                      <img
                        src={getImageUrl(currentJob?.companyId.logo)}
                        alt={`${currentJob?.companyId.companyName} logo`}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <Building size={24} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {currentJob?.companyId.companyName}
                    </h3>
                    {currentJob.companyId.website && (
                      <a
                        href={currentJob.companyId.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {t("jobDetails.visitWebsite")}
                      </a>
                    )}
                  </div>
                </div>

                {currentJob.companyId.description && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-4">
                    {currentJob.companyId.description}
                  </p>
                )}

                <button
                  onClick={() =>
                    navigate(`/user/companies/${currentJob.companyId._id}`)
                  }
                  className="text-blue-600 text-sm font-medium hover:text-blue-800"
                >
                  {t("jobDetails.viewCompanyProfile")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ApplicationApply isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default JobDetails;
