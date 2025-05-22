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
} from "lucide-react";
import { useJobs } from "../../hooks/useJobs";
import { getImageUrl } from "./CompanyCard";
import { ApplicationApply } from "./ApplicationApply";
import { useAppDispatch } from "../../redux/store";
import { setCurrentJob } from "../../redux/slices/jobsSlice";
import { useSaveJob } from "../../hooks/useSaveJob";
const JobDetails = () => {
  const dispatch = useAppDispatch();
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentJob, getJobById } = useJobs();
  const { savedJobs, saveJob, deleteSavedJob } = useSaveJob();
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (jobId) {
      getJobById(jobId);
    }
    if (savedJobs) {
      setIsSaved(savedJobs.some((job) => job.jobId._id == currentJob?._id));
    }
  }, [jobId, getJobById, savedJobs]);
  const handleApply = () => {
    dispatch(setCurrentJob(currentJob));
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

  // Format salary range
  const formatSalary = () => {
    if (!currentJob) return "Not specified";
    if (!currentJob.salaryFrom && !currentJob.salaryTo)
      return "Salary not specified";

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
    if (from) return `From ${currency}${from}`;
    if (to) return `Up to ${currency}${to}`;
    return "Salary negotiable";
  };

  // Format deadline with days remaining
  const formatDeadline = () => {
    if (!currentJob || !currentJob.deadline) return null;

    const deadline = new Date(currentJob.deadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Closing today";
    if (diffDays === 1) return "Closing tomorrow";
    return `${diffDays} days left`;
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
                  Featured Position
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
                        "Company name unavailable"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeBadgeClass()}`}
                      >
                        {currentJob?.jobType?.replace("-", " ")}
                      </span>

                      {currentJob?.experienceLevel && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {currentJob.experienceLevel} Level
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
                        ? "Unsave jobSSS"
                        : "Save jobSSS"
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
                    {currentJob?.location || "Location not specified"}
                  </span>
                </div>

                <div className="flex items-center">
                  <Briefcase size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700 capitalize">
                    {currentJob?.jobType?.replace("-", " ") || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center">
                  <DollarSign size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">{formatSalary()}</span>
                </div>

                <div className="flex items-center">
                  <Clock size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    Posted on {formatDate(currentJob?.createdAt || new Date())}
                  </span>
                </div>
              </div>
            </div>

            {/* Job description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Job Description
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
                    Key Responsibilities
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
                    Requirements
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
                  Required Skills
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
                  Benefits
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
                Apply for this position
              </h2>

              {currentJob?.deadline && (
                <div className="mb-4 flex items-center text-sm">
                  <Calendar size={16} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">
                    Application deadline:{" "}
                    {formatDate(currentJob?.deadline || new Date())}
                    {formatDeadline() && (
                      <span className="ml-2 text-red-600 font-medium">
                        ({formatDeadline()})
                      </span>
                    )}
                  </span>
                </div>
              )}

              <div className="mb-6 flex items-center text-sm">
                <Users size={16} className="text-gray-500 mr-2" />
                <span className="text-gray-700">
                  {currentJob?.applicationCount || 0} people have applied
                </span>
              </div>

              <button
                onClick={handleApply}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200"
              >
                Apply Now
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
                {isSaved ? "Saved" : "Save Job"}
              </button>
            </div>

            {/* Company info card */}
            {currentJob?.companyId && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  About the Company
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
                        Visit website
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
                  View company profile
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
