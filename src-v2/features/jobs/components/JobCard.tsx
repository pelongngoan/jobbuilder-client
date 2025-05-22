import React from "react";
import { Link } from "react-router-dom";
import { Card, Badge } from "../../../components/common";
import { JobPost } from "../../../types";
const JobCard = ({}: JobPost) => {
  // Format salary if provided
  const formattedSalary = salary
    ? `${salary.currency}${salary.min.toLocaleString()} - ${
        salary.currency
      }${salary.max.toLocaleString()}`
    : "Not specified";

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      variant="outlined"
      className={`hover:shadow-md transition-shadow ${className}`}
      padding="normal"
    >
      <div className="flex items-start gap-4">
        {/* Company logo */}
        <div className="flex-shrink-0">
          {companyLogo ? (
            <img
              src={companyLogo}
              alt={`${company} logo`}
              className="w-12 h-12 object-contain rounded"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-500 font-bold text-lg">
                {company.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Job content */}
        <div className="flex-1 min-w-0">
          <Link to={`/jobs/${id}`} className="block">
            <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 truncate">
              {title}
            </h3>
          </Link>

          <p className="mt-1 text-sm text-gray-600">
            {company} • {location}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="primary" size="sm" rounded>
              {jobType}
            </Badge>
            {salary && (
              <Badge variant="success" size="sm" rounded>
                {formattedSalary}
              </Badge>
            )}
          </div>

          {skills.length > 0 && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Skills:</p>
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="light" size="sm">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 5 && (
                  <Badge variant="light" size="sm">
                    +{skills.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Posted: {formatDate(postedDate)}
              {deadline && ` • Deadline: ${formatDate(deadline)}`}
            </div>

            {showActions && (
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="text-gray-400 hover:text-yellow-500"
                  title={isSaved ? "Remove from saved jobs" : "Save job"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isSaved ? "currentColor" : "none"}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobCard;
