import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Input } from "../../components/common";
import companyProfileService from "../../services/company";
import { CompanyProfile } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const CompanyListingsPage: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyProfile[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [industry, setIndustry] = useState("");

  const getCompaniesApi = useApiCall("getCompanies");
  const loading = useSelector(
    (state: RootState) => state.loading["getCompanies"]
  );

  const fetchCompanies = async (
    currentPage = 1,
    query = searchQuery,
    industryFilter = industry
  ) => {
    setIsSearching(true);

    try {
      await getCompaniesApi.execute(async () => {
        let response;

        try {
          if (query) {
            response = await companyProfileService.searchCompanies(
              query,
              currentPage
            );
          } else {
            response = await companyProfileService.getAllCompanies(
              currentPage,
              10,
              {
                industry: industryFilter || undefined,
              }
            );
          }

          console.log("API Response:", response); // Debug log

          if (response && response.success && response.data) {
            setCompanies(response.data.items || []);
            setTotalPages(
              Math.ceil(response.data.total / response.data.limit) || 1
            );
            setPage(response.data.page || 1);
          } else {
            setCompanies([]);
            console.error("Invalid response format", response);
          }

          return response;
        } catch (apiError) {
          console.error("API Error:", apiError);
          setCompanies([]);
          throw apiError;
        }
      });
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchCompanies(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCompanies(1, searchQuery, industry);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchCompanies(newPage, searchQuery, industry);
    }
  };

  const renderCompanyItem = (company: CompanyProfile) => {
    if (!company) return null;

    return (
      <Link
        key={company._id}
        to={`/companies/${company._id}`}
        className="block hover:shadow-lg transition-shadow duration-300"
      >
        <Card className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center mb-4">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.companyName || "Company"}
                  className="w-16 h-16 object-contain rounded-md border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-xl font-semibold">
                    {company.companyName && company.companyName.charAt(0)}
                  </span>
                </div>
              )}

              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {company.companyName || "Unnamed Company"}
                </h2>
                <p className="text-sm text-gray-500">
                  {company.industry || "Industry not specified"}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 line-clamp-3">
                {company.description || "No description available"}
              </p>
            </div>

            <div className="mt-auto">
              <div className="text-sm text-gray-500">
                {company.companySize && `Company size: ${company.companySize}`}
              </div>
              <div className="mt-2 text-sm text-blue-600">
                <span>View company profile</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Companies</h1>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex-grow">
            <Input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="md:w-1/4">
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Marketing">Marketing</option>
              <option value="Media">Media</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || isSearching}
            >
              {loading || isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading companies...</p>
        </div>
      )}

      {/* Error State */}
      {getCompaniesApi.error && (
        <div className="bg-red-100 p-4 rounded-md mb-6">
          <p className="text-red-700">Error: {getCompaniesApi.error}</p>
        </div>
      )}
      {/* Companies List */}
      {!loading && (
        <>
          {!companies || companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No companies found. Try adjusting your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => renderCompanyItem(company))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && companies && companies.length > 0 && totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="mr-2"
            >
              Previous
            </Button>

            <div className="flex space-x-2 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="ml-2"
            >
              Next
            </Button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default CompanyListingsPage;
