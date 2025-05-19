import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "../../components/common";
import useApiCall from "../../hooks/useApiCall";
import companyProfileService from "../../services/company";
import { CompanyProfileWithDetails, User } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const CompanyProfilePage: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const [company, setCompany] = useState<{
    user: User;
    profile: CompanyProfileWithDetails;
  } | null>(null);
  const getCompanyApi = useApiCall("getCompanyProfile");
  const loading = useSelector(
    (state: RootState) => state.loading["getCompanyProfile"]
  );

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (!companyId) return;
      try {
        await getCompanyApi.execute(async () => {
          try {
            const response = await companyProfileService.getCompanyProfileById(
              companyId
            );
            console.log("response", response);
            if (response.success && response.data) {
              console.log("response.data", response.data);
              setCompany(
                response.data as unknown as {
                  user: User;
                  profile: CompanyProfileWithDetails;
                }
              );
            }
            return response;
          } catch (apiError) {
            console.error("API Error:", apiError);
            throw apiError;
          }
        });
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };
    fetchCompanyProfile();
  }, [companyId]);

  if (getCompanyApi.error) {
    return (
      <div className="p-4">
        <p className="text-red-500">
          Error loading company profile: {getCompanyApi.error}
        </p>
      </div>
    );
  }

  if (loading || !company) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Company Header */}
        <div className="relative">
          <div className="h-48 bg-gray-200" />

          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">
              {company.profile.companyName}
            </h1>
            <p className="text-white text-lg">
              {company.profile.industry || "Industry not specified"}
            </p>
          </div>
        </div>

        {/* Company Info */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}
            <div className="md:w-2/3">
              <Card className="mb-6 p-4">
                <h2 className="text-xl font-semibold mb-3">
                  About {company.profile.companyName}
                </h2>
                <p className="text-gray-700">
                  {company.profile.description || "No description available"}
                </p>
              </Card>

              {company.profile.companyValues &&
                company.profile.companyValues.length > 0 && (
                  <Card className="mb-6 p-4">
                    <h2 className="text-xl font-semibold mb-3">
                      Company Values
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {company.profile.companyValues.map((value, index) => (
                        <li key={index} className="text-gray-700">
                          {value}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

              {company.profile.benefits &&
                company.profile.benefits.length > 0 && (
                  <Card className="mb-6 p-4">
                    <h2 className="text-xl font-semibold mb-3">
                      Benefits & Perks
                    </h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {company.profile.benefits.map((benefit, index) => (
                        <li key={index} className="text-gray-700">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
            </div>

            {/* Right Column */}
            <div className="md:w-1/3">
              <Card className="mb-6 p-4">
                <h2 className="text-lg font-semibold mb-3">Company Details</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-sm">Website</p>
                    {company.profile.website ? (
                      <a
                        href={company.profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {company.profile.website}
                      </a>
                    ) : (
                      <p className="text-gray-800">Not available</p>
                    )}
                  </div>
                  {company.profile.foundingYear && (
                    <div>
                      <p className="text-gray-500 text-sm">Founded</p>
                      <p className="text-gray-800">
                        {company.profile.foundingYear}
                      </p>
                    </div>
                  )}
                  {company.profile.companySize && (
                    <div>
                      <p className="text-gray-500 text-sm">Company Size</p>
                      <p className="text-gray-800">
                        {company.profile.companySize}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="mb-6 p-4">
                <h2 className="text-lg font-semibold mb-3">Open Positions</h2>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() =>
                    (window.location.href = `/jobs?company=${company.profile._id}`)
                  }
                >
                  View Open Jobs
                </Button>
              </Card>

              {company.profile.socialMedia &&
                Object.keys(company.profile.socialMedia).length > 0 && (
                  <Card className="p-4">
                    <h2 className="text-lg font-semibold mb-3">Connect</h2>
                    <div className="flex space-x-3">
                      {company.profile.socialMedia.linkedin && (
                        <a
                          href={company.profile.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                      {company.profile.socialMedia.twitter && (
                        <a
                          href={company.profile.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-400"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.028 10.028 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06c0 2.385 1.693 4.374 3.946 4.827a4.928 4.928 0 01-2.212.085 4.935 4.935 0 004.604 3.417 9.875 9.875 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.9 13.9 0 007.55 2.213c9.053 0 14-7.496 14-13.986 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59l-.047-.02z" />
                          </svg>
                        </a>
                      )}
                      {company.profile.socialMedia.facebook && (
                        <a
                          href={company.profile.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-600"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </Card>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
