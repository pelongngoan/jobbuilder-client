import React, { useEffect, useState } from "react";
import { useJobs } from "../../hooks/useJobs";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { useCategory } from "../../hooks/useCategory";
import { useTranslation } from "react-i18next";

export const JobSearchPage = () => {
  const { t } = useTranslation();
  const { jobs, searchJobs, loading, error } = useJobs();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get current search parameters
  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const category = searchParams.get("category") || "";

  // Local state for form inputs
  const [searchForm, setSearchForm] = useState({
    jobName: query,
    location: location,
    category: category,
  });

  const { page, limit, totalPages } = useAppSelector(
    (state) => state.pagination
  );
  const { categories } = useCategory();
  // Job categories for dropdown
  const jobCategories = [
    "Danh mục Nghề",
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Marketing",
    "Sales",
    "Engineering",
    "Design",
    "Customer Service",
    "Human Resources",
    "Operations",
    "Legal",
    "Consulting",
    "Manufacturing",
  ];

  // Experience levels
  const experienceLevels = [
    t("jobSearch.allExperience"),
    t("jobSearch.under1Year"),
    `1 ${t("jobSearch.years")}`,
    `2 ${t("jobSearch.years")}`,
    `3 ${t("jobSearch.years")}`,
    `4 ${t("jobSearch.years")}`,
    `5 ${t("jobSearch.years")}`,
    t("jobSearch.over5Years"),
  ];

  // Search jobs when URL parameters change
  useEffect(() => {
    if (query || location || category) {
      searchJobs(query, location, category, page, limit);
    }
  }, [query, location, category, page, limit, searchJobs]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    // Update URL parameters
    const newParams = new URLSearchParams();
    if (searchForm.jobName.trim()) {
      newParams.set("q", searchForm.jobName.trim());
    }
    if (searchForm.location.trim()) {
      newParams.set("location", searchForm.location.trim());
    }
    if (searchForm.category && searchForm.category !== "Danh mục Nghề") {
      newParams.set("category", searchForm.category);
    }

    setSearchParams(newParams);
  };

  // Handle job click
  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Green Header with Search */}
      <div className="bg-green-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <form onSubmit={handleSearch} className="flex items-center gap-4">
              {/* Category Dropdown */}
              <div className="flex items-center border-r border-gray-300 pr-4">
                <div className="flex items-center text-gray-600 mr-2">
                  <span className="text-lg">☰</span>
                </div>
                <select
                  name="category"
                  value={searchForm.category}
                  onChange={handleInputChange}
                  className="border-none outline-none bg-transparent text-gray-700 font-medium min-w-[120px]"
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <span className="text-gray-400 ml-1">▼</span>
              </div>

              {/* Job Search Input */}
              <div className="flex-1 flex items-center">
                <div className="flex items-center text-gray-400 mr-3">
                  <span className="text-lg">🔍</span>
                </div>
                <input
                  type="text"
                  name="jobName"
                  value={searchForm.jobName}
                  onChange={handleInputChange}
                  placeholder={t("jobSearch.searchPlaceholder")}
                  className="flex-1 border-none outline-none text-gray-700 placeholder-gray-400"
                />
                {searchForm.jobName && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchForm((prev) => ({ ...prev, jobName: "" }))
                    }
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Location Input */}
              <div className="flex items-center border-l border-gray-300 pl-4">
                <div className="flex items-center text-gray-400 mr-3">
                  <span className="text-lg">📍</span>
                </div>
                <input
                  type="text"
                  name="location"
                  value={searchForm.location}
                  onChange={handleInputChange}
                  placeholder={t("jobSearch.locationPlaceholder")}
                  className="border-none outline-none text-gray-700 placeholder-gray-400 min-w-[100px]"
                />
                <span className="text-gray-400 ml-1">▼</span>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-medium transition-colors"
              >
                {t("jobSearch.searchButton")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <div className="text-lg font-medium text-gray-800 mb-2">
            Tuyển dụng 2 việc làm Remote Job [Update{" "}
            {new Date().toLocaleDateString("vi-VN")}]
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-2">
            <span className="text-green-600">{t("jobSearch.homepage")}</span>
            <span>›</span>
            <span>{t("jobSearch.jobs")}</span>
            <span>›</span>
            <span>Remote Job</span>
          </div>
        </div>

        {/* Job Tags */}
        <div className="mb-6">
          <span className="text-gray-600 mr-2">
            {t("jobSearch.suggestedKeywords")}
          </span>
          <div className="inline-flex flex-wrap gap-2">
            {[
              "part-time",
              "thực tập sinh",
              "công tác viên",
              "nhân viên văn phòng",
              "freelancer",
              "intern",
              "việc online",
              "remote",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setSearchForm((prev) => ({ ...prev, jobName: tag }))
                }
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-80 flex-shrink-0">
            {/* Advanced Filters */}
            <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800 flex items-center">
                  <span className="text-green-600 mr-2">▼</span>
                  Lọc nâng cao
                </h3>
              </div>

              {/* Search Options */}
              <div className="mb-6">
                <div className="flex gap-4 text-sm">
                  <button className="text-gray-400">Xóa lọc</button>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">Tìm kiếm theo:</span>
                  <button className="text-gray-600 hover:text-green-600">
                    Tên việc làm
                  </button>
                  <button className="text-gray-600 hover:text-green-600">
                    Tên công ty
                  </button>
                  <button className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                    Cả hai
                  </button>
                </div>
              </div>

              {/* Job Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">
                  Theo danh mục nghề
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 text-green-600" />
                    <span className="text-gray-700">
                      Giáo viên/Giảng viên/Gia sư (2)
                    </span>
                  </label>
                  <div className="ml-6">
                    <button className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      Giáo viên tiếng Anh
                    </button>
                  </div>
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Kinh nghiệm</h4>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="experience"
                        className="mr-2 text-green-600"
                        defaultChecked={level === "Tất cả"}
                      />
                      <span className="text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Education Level */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Cấp bậc</h4>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="level"
                    className="mr-2 text-green-600"
                    defaultChecked
                  />
                  <span className="text-gray-700">Tất cả</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Content - Job Results */}
          <div className="flex-1">
            {/* Results Count */}
            {jobs && (
              <div className="mb-4">
                <p className="text-gray-600">
                  Hiển thị {jobs.length} việc làm phù hợp
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
              </div>
            )}

            {/* Job Cards */}
            <div className="space-y-4">
              {jobs &&
                jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => handleJobClick(job.id)}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                  >
                    <div className="flex gap-4">
                      {/* Company Logo */}
                      <div className="w-16 h-16 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {job.company
                            ? job.company.substring(0, 2).toUpperCase()
                            : "CO"}
                        </span>
                      </div>

                      {/* Job Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors">
                            {job.title ||
                              "Giáo Viên Tiếng Anh Giao Tiếp 1:1 (Remote Job)"}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 font-medium">
                              4 - 8 triệu
                            </span>
                            <button className="text-gray-400 hover:text-red-500">
                              <span className="text-xl">♡</span>
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-600 font-medium mb-2">
                          {job.company || "TRUNG TÂM NGOẠI NGỮ BINGGO LEADERS"}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span>
                            📍 {job.location || "Hà Nội & 4 nơi khác"}
                          </span>
                          <span>🕐 Không yêu cầu</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              Giáo viên tiếng Anh
                            </span>
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              Giáo dục / Đào tạo
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>Đăng 2 ngày trước</span>
                            <button className="text-green-600 hover:text-green-700">
                              <span className="text-lg">♡</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {/* Mock Job Card 2 */}
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">LG</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900 hover:text-green-600 transition-colors">
                        Giáo Viên Tiếng Anh Giao Tiếp (Remote Job)
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 font-medium">
                          4 - 8 triệu
                        </span>
                        <button className="text-gray-400 hover:text-red-500">
                          <span className="text-xl">♡</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium mb-2">
                      CÔNG TY CỔ PHẦN ĐẦU TƯ HBR HOLDINGS
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>📍 Hà Nội</span>
                      <span>🕐 Không yêu cầu</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          Giáo viên tiếng Anh
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Đăng 3 tuần trước</span>
                        <span>Đã xem</span>
                        <button className="text-green-600 hover:text-green-700">
                          <span className="text-lg">♡</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* No Results */}
            {jobs && jobs.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">Không tìm thấy việc làm phù hợp</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
