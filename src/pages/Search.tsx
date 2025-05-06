import { useState, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { getAllJobs } from "../lib/api/services/jobs";
import { JobPost } from "../types/job";
import { SearchJobCard } from "../components/shared/SearchJobCard";
import { JobDetailPanel } from "../components/shared/JobDetailPanel";

// Filter state and options
const filterOptions: Record<string, string[]> = {
  jobType: [
    "full-time",
    "part-time",
    "contract",
    "internship",
    "remote",
    "Other",
  ],
  location: ["New York", "San Francisco", "London", "Remote", "Other"],
  experienceLevel: ["Entry", "Mid", "Senior", "Executive", "Other"],
  salaryType: ["hourly", "monthly", "yearly", "Other"],
  benefits: [
    "Health Insurance",
    "Remote Work",
    "Paid Time Off",
    "Stock Options",
    "Other",
  ],
};

type FilterState = Record<string, string[]>;

const initialFilters: FilterState = {
  jobType: [],
  location: [],
  experienceLevel: [],
  salaryType: [],
  benefits: [],
};

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] =
    useState<FilterState>(initialFilters);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [customFilterInputs, setCustomFilterInputs] = useState<
    Record<string, string>
  >({});
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  // Fetch jobs from backend
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, unknown> = {
        page,
        title: searchQuery,
      };
      if ((selectedFilters.jobType as string[]).length)
        params.jobType = selectedFilters.jobType.join(",");
      if ((selectedFilters.location as string[]).length)
        params.location = selectedFilters.location.join(",");
      if ((selectedFilters.experienceLevel as string[]).length)
        params.experienceLevel = selectedFilters.experienceLevel.join(",");
      if ((selectedFilters.salaryType as string[]).length)
        params.salaryType = selectedFilters.salaryType.join(",");
      if ((selectedFilters.benefits as string[]).length)
        params.benefits = selectedFilters.benefits;
      const res = await getAllJobs(params);
      setJobs(res.data);
      setTotal(res.total);
    } catch {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, [searchQuery, selectedFilters, page]);

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentFilters = prev[category] || [];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter((filter) => filter !== value)
        : [...currentFilters, value];
      return {
        ...prev,
        [category]: newFilters,
      };
    });
  };

  const clearAllFilters = () => setSelectedFilters(initialFilters);

  const handleCustomFilterInput = (category: string, value: string) => {
    setCustomFilterInputs((prev) => ({ ...prev, [category]: value }));
  };

  const addCustomFilter = (category: string) => {
    const value = customFilterInputs[category]?.trim();
    if (value) {
      setSelectedFilters((prev) => {
        // Remove 'Other' and add the custom value
        const filtered = (prev[category] || []).filter((v) => v !== "Other");
        return {
          ...prev,
          [category]: [...filtered, value],
        };
      });
      setCustomFilterInputs((prev) => ({ ...prev, [category]: "" }));
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Filters
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700"
                      onClick={clearAllFilters}
                    >
                      Clear all
                    </Button>
                  </div>
                  {/* Filter Sections */}
                  {Object.entries(filterOptions).map(([category, options]) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center justify-between">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        <ChevronDown className="h-4 w-4" />
                      </h3>
                      <div className="space-y-2">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-900"
                          >
                            <input
                              type="checkbox"
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              checked={(
                                selectedFilters[category] || []
                              ).includes(option)}
                              onChange={() => toggleFilter(category, option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                        {/* Show input if 'Other' is checked */}
                        {(selectedFilters[category] || []).includes(
                          "Other"
                        ) && (
                          <div className="flex items-center space-x-2 mt-2">
                            <Input
                              placeholder={`Enter other ${category}`}
                              value={customFilterInputs[category] || ""}
                              onChange={(e) =>
                                handleCustomFilterInput(
                                  category,
                                  e.target.value
                                )
                              }
                              onBlur={() => addCustomFilter(category)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  addCustomFilter(category);
                              }}
                              className="w-full border-blue-400"
                              autoFocus
                            />
                            <span className="text-xs text-slate-400">
                              Press Enter
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            {/* Job Listings */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-slate-600">
                  Showing <span className="font-medium">{total}</span> results
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Filter className="h-4 w-4" />}
                >
                  Sort by: Newest
                </Button>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div>Loading...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : jobs.length === 0 ? (
                  <div>No jobs found.</div>
                ) : (
                  jobs.map((job) => (
                    <SearchJobCard
                      key={job._id}
                      job={job}
                      onClick={() => setSelectedJob(job)}
                    />
                  ))
                )}
              </div>
              {/* Load More */}
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={jobs.length >= total}
                >
                  Load More Jobs
                </Button>
              </div>
            </div>
            {/* Job Detail Panel */}
            <div className="lg:col-span-1">
              {selectedJob ? (
                <JobDetailPanel
                  job={selectedJob}
                  onClose={() => setSelectedJob(null)}
                />
              ) : (
                <div className="text-slate-400 p-4">
                  Select a job to see details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
