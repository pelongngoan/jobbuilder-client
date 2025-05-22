import { useParams } from "react-router-dom";
import { useCompany } from "../../hooks/useCompany";
import { useEffect } from "react";
import { useJobs } from "../../hooks/useJobs";
import JobCard from "./JobCard";
import { getImageUrl } from "./CompanyCard";
export const CompanyDetail = () => {
  const { getCompanyById, currentCompany } = useCompany();
  const { getCompanyJobs, jobs } = useJobs();
  const { companyId } = useParams();

  useEffect(() => {
    getCompanyById(companyId || "");
    getCompanyJobs(companyId || "");
  }, [companyId]);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header section with company name and logo */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        {currentCompany?.wallPaper && (
          <div className="w-full h-48 mb-6 overflow-hidden rounded-md">
            <img
              src={getImageUrl(currentCompany.wallPaper)}
              alt="Company banner"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 flex-shrink-0">
            {currentCompany?.logo && (
              <img
                src={getImageUrl(currentCompany.logo)}
                alt={currentCompany?.companyName || "Company logo"}
                className="w-full h-full object-contain rounded-md shadow-sm"
              />
            )}
          </div>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {currentCompany?.companyName}
            </h1>
            <div className="flex flex-wrap gap-y-2 text-gray-500">
              {currentCompany?.domain && (
                <div className="w-full md:w-auto md:mr-4">
                  <span className="font-medium">Industry:</span>{" "}
                  {currentCompany.domain}
                </div>
              )}
              {currentCompany?.address && (
                <div className="w-full md:w-auto">
                  <span className="font-medium">Location:</span>{" "}
                  {currentCompany.address}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area with two columns: company info on left, jobs on right */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: Company information */}
        <div className="w-full lg:w-2/5">
          {/* About section */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="leading-relaxed">{currentCompany?.description}</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4 text-gray-600">
              {currentCompany?.email && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <a
                    href={`mailto:${currentCompany.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {currentCompany.email}
                  </a>
                </div>
              )}
              {currentCompany?.phone && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Phone:</span>
                  <a
                    href={`tel:${currentCompany.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {currentCompany.phone}
                  </a>
                </div>
              )}
              {currentCompany?.website && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Website:</span>
                  <a
                    href={currentCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {currentCompany.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Jobs listings */}
        <div className="w-full lg:w-3/5">
          {/* Jobs section */}
          {jobs && jobs.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Available Positions ({jobs.length})
              </h2>
              <div className="grid grid-cols-1 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} onClick={() => {}} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Positions Available
              </h2>
              <p className="text-gray-600">
                This company is not currently listing any open positions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
