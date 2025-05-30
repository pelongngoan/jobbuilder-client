import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  LocationOn,
  Work,
  AttachMoney,
  Category,
} from "@mui/icons-material";
import { useJobs } from "../../hooks/useJobs";
import { useTranslation } from "react-i18next";
import { JobCategory } from "../../services";
import JobCard from "./JobCard";

interface SearchFilters {
  title: string;
  location: string;
  category: string;
  jobType: string;
  experienceLevel: string;
  salaryFrom: string;
  salaryTo: string;
  salaryCurrency: string;
}

export const JobSearchPage = () => {
  const { t } = useTranslation();
  const { jobs, searchJobs, getAllJobCategories } = useJobs();

  const [filters, setFilters] = useState<SearchFilters>({
    title: "",
    location: "",
    category: "",
    jobType: "",
    experienceLevel: "",
    salaryFrom: "",
    salaryTo: "",
    salaryCurrency: "VND",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const itemsPerPage = 10;

  // Job types and experience levels options
  const jobTypes = [
    "full-time",
    "part-time",
    "contract",
    "freelance",
    "internship",
  ];
  const experienceLevels = [
    "entry",
    "junior",
    "mid",
    "senior",
    "lead",
    "executive",
  ];
  const currencies = ["VND", "USD", "EUR", "GBP", "JPY", "CNY"];

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setCurrentPage(1);

    try {
      await searchJobs({
        title: filters.title || undefined,
        location: filters.location || undefined,
        category: filters.category || undefined,
        jobType: filters.jobType || undefined,
        experienceLevel: filters.experienceLevel || undefined,
        salaryFrom: filters.salaryFrom ? Number(filters.salaryFrom) : undefined,
        salaryTo: filters.salaryTo ? Number(filters.salaryTo) : undefined,
        salaryCurrency: filters.salaryCurrency || undefined,
        page: 1,
        limit: itemsPerPage,
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    setLoading(true);

    try {
      await searchJobs({
        title: filters.title || undefined,
        location: filters.location || undefined,
        category: filters.category || undefined,
        jobType: filters.jobType || undefined,
        experienceLevel: filters.experienceLevel || undefined,
        salaryFrom: filters.salaryFrom ? Number(filters.salaryFrom) : undefined,
        salaryTo: filters.salaryTo ? Number(filters.salaryTo) : undefined,
        salaryCurrency: filters.salaryCurrency || undefined,
        page,
        limit: itemsPerPage,
      });
    } catch (error) {
      console.error("Page change error:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      title: "",
      location: "",
      category: "",
      jobType: "",
      experienceLevel: "",
      salaryFrom: "",
      salaryTo: "",
      salaryCurrency: "USD",
    });
  };

  // Load categories and initial jobs on component mount
  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await getAllJobCategories();
      setCategories(categoriesData);
    };

    loadCategories();
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {t("jobSearch.title", "Find Your Dream Job")}
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover thousands of opportunities and take the next step in your
            career journey
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <SearchIcon className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {t("jobSearch.filters", "Search Filters")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Title Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("jobSearch.jobTitle", "Job Title")}
              </label>
              <div className="relative">
                <Work className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder={t(
                    "jobSearch.titlePlaceholder",
                    "e.g. Software Engineer"
                  )}
                  value={filters.title}
                  onChange={(e) => handleFilterChange("title", e.target.value)}
                />
              </div>
            </div>

            {/* Location Search */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("jobSearch.location", "Location")}
              </label>
              <div className="relative">
                <LocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder={t(
                    "jobSearch.locationPlaceholder",
                    "e.g. New York, Remote"
                  )}
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("jobSearch.category", "Category")}
              </label>
              <div className="relative">
                <Category className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                >
                  <option value="">
                    {t("jobSearch.allCategories", "All Categories")}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("jobSearch.jobType", "Job Type")}
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                value={filters.jobType}
                onChange={(e) => handleFilterChange("jobType", e.target.value)}
              >
                <option value="">{t("jobSearch.allTypes", "All Types")}</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {t(
                      `jobTypes.${type}`,
                      type.charAt(0).toUpperCase() + type.slice(1)
                    )}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("jobSearch.experienceLevel", "Experience Level")}
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                value={filters.experienceLevel}
                onChange={(e) =>
                  handleFilterChange("experienceLevel", e.target.value)
                }
              >
                <option value="">
                  {t("jobSearch.allLevels", "All Levels")}
                </option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {t(
                      `experienceLevels.${level}`,
                      level.charAt(0).toUpperCase() + level.slice(1)
                    )}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("jobSearch.currency", "Currency")}
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
                value={filters.salaryCurrency}
                onChange={(e) =>
                  handleFilterChange("salaryCurrency", e.target.value)
                }
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </label>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <AttachMoney className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder={t("jobSearch.salaryFrom", "Min Salary")}
                  value={filters.salaryFrom}
                  onChange={(e) =>
                    handleFilterChange("salaryFrom", e.target.value)
                  }
                />
              </div>
              <span className="text-gray-500 font-medium">to</span>
              <div className="relative flex-1">
                <AttachMoney className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                  placeholder={t("jobSearch.salaryTo", "Max Salary")}
                  value={filters.salaryTo}
                  onChange={(e) =>
                    handleFilterChange("salaryTo", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <SearchIcon className="w-5 h-5" />
              )}
              {t("jobSearch.search", "Search Jobs")}
            </button>
            <button
              onClick={clearFilters}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all duration-200"
            >
              {t("jobSearch.clearFilters", "Clear Filters")}
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {t("jobSearch.results", "Search Results")}
            </h2>
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              {jobs.length} {t("jobSearch.jobsFound", "jobs found")}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading jobs...</p>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t("jobSearch.noResults", "No jobs found")}
              </h3>
              <p className="text-gray-600 mb-6">
                {t(
                  "jobSearch.tryDifferentFilters",
                  "Try adjusting your search filters"
                )}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {jobs.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-lg"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
