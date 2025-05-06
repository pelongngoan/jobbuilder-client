import { JobPost } from "../../types/job";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building,
  Bookmark,
  Share2,
  X,
} from "lucide-react";

interface JobDetailPanelProps {
  job: JobPost;
  onClose: () => void;
}

export const JobDetailPanel = ({ job, onClose }: JobDetailPanelProps) => {
  return (
    <Card className="relative h-full">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 z-10"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </Button>
      <CardContent className="p-6 overflow-y-auto max-h-[90vh]">
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
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              <Building className="h-4 w-4" />
              <span>{job.companyName}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 text-sm mb-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" />
                {job.jobType}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {job.salaryRange}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {job.createdAt?.slice(0, 10)}
              </div>
            </div>
            <div className="text-xs text-slate-500 mb-2">
              Experience: {job.experienceLevel || "N/A"} | Salary Type:{" "}
              {job.salaryType || "N/A"}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-blue-600"
                leftIcon={<Bookmark className="h-4 w-4" />}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-blue-600"
                leftIcon={<Share2 className="h-4 w-4" />}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Job Description</h3>
          <p className="text-slate-700 whitespace-pre-line text-sm">
            {job.description}
          </p>
        </div>
        {Array.isArray(job.benefits) && job.benefits.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Benefits</h3>
            <div className="flex flex-wrap gap-2">
              {job.benefits.map((benefit, idx) => (
                <span
                  key={String(benefit) + idx}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {String(benefit)}
                </span>
              ))}
            </div>
          </div>
        )}
        {Array.isArray(job.requirements) && job.requirements.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Requirements</h3>
            <ul className="list-disc list-inside text-slate-700 text-sm">
              {job.requirements.map((req, idx) => (
                <li key={String(req) + idx}>{String(req)}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6">
          <Button variant="primary" size="lg" className="w-full">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
