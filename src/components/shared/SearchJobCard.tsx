import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  ChevronRight,
  Building,
  Bookmark,
  Share2,
} from "lucide-react";
import { JobPost } from "../../types/job";
import { useNavigate } from "react-router-dom";

interface SearchJobCardProps {
  job: JobPost;
  onClick?: () => void;
}

export const SearchJobCard = ({ job, onClick }: SearchJobCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      variant="bordered"
      className="group hover:border-blue-500 cursor-pointer"
      onClick={() => {
        if (onClick) onClick();
        else navigate(`/search/job-detail/${job._id}`);
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img
            src={
              typeof job.logoCompany === "string" && job.logoCompany
                ? job.logoCompany
                : "https://ui-avatars.com/api/?name=J&background=6366f1&color=fff"
            }
            alt={job.companyName}
            className="w-12 h-12 rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-600 mt-1">
                  <Building className="h-4 w-4" />
                  <span>{job.companyName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-blue-600"
                  leftIcon={<Bookmark className="h-4 w-4" />}
                  onClick={(e) => e.stopPropagation()}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-blue-600"
                  leftIcon={<Share2 className="h-4 w-4" />}
                  onClick={(e) => e.stopPropagation()}
                >
                  Share
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="flex items-center text-slate-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.jobType}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <DollarSign className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.salaryRange}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">{job.createdAt?.slice(0, 10)}</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Experience: {job.experienceLevel || "N/A"} | Salary Type:{" "}
              {job.salaryType || "N/A"}
            </div>
            <p className="text-slate-600 mt-4 line-clamp-2">
              {job.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {Array.isArray(job.benefits) &&
                job.benefits.map((req, idx) => (
                  <span
                    key={(String(req) || `benefit-`) + idx}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {String(req)}
                  </span>
                ))}
            </div>
            <div className="mt-4">
              <Button
                variant="outline"
                className="group-hover:border-blue-500 group-hover:bg-blue-50"
                rightIcon={<ChevronRight className="h-4 w-4" />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/search/job-detail/${job._id}`);
                }}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchJobCard;
