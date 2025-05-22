import { CompanyProfile } from "../../types";
import { useNavigate } from "react-router-dom";
// Utility function to get complete image URL
export const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  // Replace this with your actual API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return `${API_BASE_URL}${path}`;
};

export const CompanyCard = ({ company }: { company: CompanyProfile }) => {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`${company._id}`);
  };
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Company Header with Wall Paper */}
      <div
        className="h-32 bg-cover bg-center"
        style={{
          backgroundImage: company.wallPaper
            ? `url(${getImageUrl(company.wallPaper)})`
            : "linear-gradient(to right, #4f46e5, #3b82f6)",
        }}
      />

      {/* Company Logo and Basic Info */}
      <div className="px-6 pt-6 pb-4 relative">
        <div className="absolute -top-10 left-6 w-16 h-16 rounded-full bg-white p-1 shadow-md">
          {company.logo ? (
            <img
              src={getImageUrl(company.logo)}
              alt={`${company.companyName} logo`}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
              {company.companyName?.charAt(0)}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-bold text-xl mb-1">{company.companyName}</h3>
          <p className="text-gray-600 text-sm mb-2">{company.domain}</p>

          {company.description && (
            <p className="text-gray-700 text-sm line-clamp-2 mb-4">
              {company.description}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex flex-col space-y-2 text-sm">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              {company.website.replace(/https?:\/\//, "")}
            </a>
          )}

          {company.email && (
            <a
              href={`mailto:${company.email}`}
              className="text-gray-600 hover:text-gray-800 truncate"
            >
              {company.email}
            </a>
          )}

          {company.address && (
            <p className="text-gray-600 truncate">{company.address}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-3 bg-gray-50 flex justify-end">
        <button
          onClick={handleViewDetails}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
