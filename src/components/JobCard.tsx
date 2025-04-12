import { useState } from "react";
import {
  MapPin,
  Building,
  Clock,
  DollarSign,
  Bookmark,
  Share2,
  ExternalLink,
} from "lucide-react";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  description: string;
  logo?: string;
  id: string;
}

export const JobCard = ({
  title,
  company,
  location,
  type,
  salary,
  postedDate,
  description,
  logo,
  id,
}: JobCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="job-card p-4 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-md bg-theme-secondary flex items-center justify-center mr-4 overflow-hidden">
            {logo ? (
              <img
                src={logo}
                alt={`${company} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <Building className="h-6 w-6 text-theme-secondary" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-theme-primary">
              {title}
            </h3>
            <p className="text-theme-secondary">{company}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleSave}
            className={`p-1 rounded-full ${
              isSaved ? "text-accent" : "text-theme-secondary"
            } hover:bg-theme-secondary transition-colors`}
            aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button
            className="p-1 rounded-full text-theme-secondary hover:bg-theme-secondary transition-colors"
            aria-label="Share job"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center text-sm text-theme-secondary">
          <MapPin size={16} className="mr-1" />
          <span>{location}</span>
        </div>
        <div className="flex items-center text-sm text-theme-secondary">
          <Clock size={16} className="mr-1" />
          <span>{type}</span>
        </div>
        <div className="flex items-center text-sm text-theme-secondary">
          <DollarSign size={16} className="mr-1" />
          <span>{salary}</span>
        </div>
      </div>

      <p className="mt-3 text-theme-secondary text-sm line-clamp-2">
        {description}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-theme-secondary">
          Posted {postedDate}
        </span>
        <a
          href={`/jobs/${id}`}
          className="text-sm font-medium text-accent hover:text-primary-600 flex items-center"
        >
          View Details
          <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </div>
  );
};
