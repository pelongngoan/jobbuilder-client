import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import jobService from "../../services/jobService";
import jobCategoryService from "../../services/category";
import companyProfileService from "../../services/company";
import { setHrCompanies } from "../../redux/slices/companySlice";
import { JobRequest, JobType, SalaryType, JobCategory } from "../../types";
import useApiCall from "../../hooks/useApiCall";

const PostJobPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state: RootState) => state.auth);
  const { userProfile } = useSelector((state: RootState) => state.profile);
  const { hrCompanies } = useSelector((state: RootState) => state.company);

  // API calls
  const createJobApi = useApiCall("createJob");
  const importJobsApi = useApiCall("importJobs");

  // States
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importStats, setImportStats] = useState<{
    successCount: number;
    failedCount: number;
  } | null>(null);

  const [formData, setFormData] = useState<JobRequest>({
    title: "",
    location: "",
    jobType: "full-time" as JobType,
    salaryRange: "",
    salaryCurrency: "USD",
    salaryType: "yearly" as SalaryType,
    description: "",
    keyResponsibilities: [""],
    benefits: [""],
    requirements: [""],
    skills: [],
    status: "draft",
    deadline: "",
    contactEmail: user?.email || "",
    contactPhone: "",
    companyName: "",
    companyWebsite: "",
  });

  // Load HR companies on component mount
  useEffect(() => {
    const loadHrCompanies = async () => {
      try {
        if (userProfile?._id) {
          const response = await companyProfileService.getCompanyHRMembers(
            userProfile._id
          );
          if (response.success && response.data) {
            // Transform the data to match the company interface
            const hrCompanyData = response.data.map((hr) => ({
              user: hr.user,
              profile: hr.profile,
            }));
            dispatch(setHrCompanies(hrCompanyData));
          }
        }
      } catch (err) {
        console.error("Failed to load HR companies", err);
      }
    };

    loadHrCompanies();
  }, [dispatch, userProfile]);

  // Load job categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await jobCategoryService.getJobCategories();
        if (response.success && response.data) {
          setJobCategories(response.data);
        }
      } catch (err) {
        console.error("Failed to load job categories", err);
      }
    };

    loadCategories();
  }, []);

  // Update form data
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle array fields (responsibilities, benefits, requirements)
  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "keyResponsibilities" | "benefits" | "requirements"
  ) => {
    const { value } = e.target;
    setFormData((prev) => {
      const newArray = [...(prev[field] || [])];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  // Add new item to array fields
  const addArrayItem = (
    field: "keyResponsibilities" | "benefits" | "requirements"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };

  // Remove item from array fields
  const removeArrayItem = (
    index: number,
    field: "keyResponsibilities" | "benefits" | "requirements"
  ) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] || [])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  // Download CSV template
  const downloadTemplate = () => {
    // CSV header
    const header = [
      "title",
      "location",
      "jobType",
      "salaryRange",
      "salaryCurrency",
      "salaryType",
      "description",
      "keyResponsibilities",
      "benefits",
      "requirements",
      "category",
      "status",
      "deadline",
      "contactEmail",
      "contactPhone",
      "companyName",
      "companyWebsite",
      "experienceLevel",
    ].join(",");

    // Example data
    const exampleData = [
      "Senior React Developer",
      "San Francisco, CA",
      "full-time",
      "80000-120000",
      "USD",
      "yearly",
      "We are looking for an experienced React developer...",
      '"Build user interfaces using React;Implement responsive designs;Write clean code"',
      '"Health insurance;401k matching;Flexible work schedule"',
      '"5+ years of experience with React;Strong TypeScript skills;Experience with state management"',
      "", // category ID would go here
      "draft",
      "2023-12-31",
      "careers@example.com",
      "(123) 456-7890",
      "Example Tech",
      "https://example.com",
      "Senior",
    ].join(",");

    // Create CSV content
    const csv = `${header}\n${exampleData}`;

    // Create download link
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "job_template.csv");
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Import jobs from CSV
  const handleImportJobs = async () => {
    if (!selectedFile) {
      setError("Please select a CSV file to import");
      return;
    }

    await importJobsApi.execute(async () => {
      try {
        // Get company ID from profile state
        const companyId = userProfile?._id;

        if (!companyId) {
          throw new Error(
            "Company ID not found. Please update your company profile first."
          );
        }

        const response = await jobService.importJobsFromCSV(
          selectedFile,
          companyId
        );

        if (response.success) {
          setImportSuccess(true);
          setImportStats({
            successCount: response.data?.successCount || 0,
            failedCount: response.data?.failedCount || 0,
          });

          // After a delay, refresh the jobs list
          setTimeout(() => {
            navigate("/management/jobs");
          }, 2000);
        } else {
          setError(response.error || "Failed to import jobs");
        }

        return response;
      } catch (err) {
        const error = err as Error;
        setError(error.message || "An error occurred during import");
        throw err;
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    await createJobApi.execute(async () => {
      try {
        const jobData = { ...formData };

        // Remove empty items from arrays
        jobData.keyResponsibilities = jobData.keyResponsibilities?.filter(
          (item) => item.trim() !== ""
        );
        jobData.benefits = jobData.benefits?.filter(
          (item) => item.trim() !== ""
        );
        jobData.requirements = jobData.requirements?.filter(
          (item) => item.trim() !== ""
        );

        const response = await jobService.createJob(jobData);

        if (response.success && response.data) {
          setSuccess(true);
          // Navigate to the job details page after a delay
          setTimeout(() => {
            navigate(`/management/jobs/${response.data?._id}`);
          }, 2000);
        } else {
          setError(response.error || "Failed to create job listing");
        }

        return response;
      } catch (err) {
        const error = err as Error;
        setError(error.message || "An error occurred while creating the job");
        throw err;
      }
    });
  };

  // Only company and HR roles can post jobs
  if (role !== "company" && role !== "hr" && role !== "admin") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p>You do not have permission to post job listings.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          Job listing created successfully! Redirecting to job details page...
        </div>
      )}

      {importSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-medium">CSV Import Completed</p>
          <p>Successfully imported: {importStats?.successCount} jobs</p>
          {importStats?.failedCount ? (
            <p>Failed to import: {importStats.failedCount} jobs</p>
          ) : null}
          <p>Redirecting to jobs list...</p>
        </div>
      )}

      {/* CSV Import Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Bulk Import Jobs</h2>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
          <button
            type="button"
            onClick={downloadTemplate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download CSV Template
          </button>

          <div className="flex-1">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Upload a CSV file with job data. Use the template for correct
              format.
            </p>
          </div>

          <button
            type="button"
            onClick={handleImportJobs}
            disabled={!selectedFile || importJobsApi.loading}
            className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
              !selectedFile || importJobsApi.loading
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {importJobsApi.loading ? "Importing..." : "Import Jobs"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Title */}
        <div className="form-group">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Senior React Developer"
          />
        </div>

        {/* Job Category */}
        <div className="form-group">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category?.toString() || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {jobCategories.map((category) => (
              <option
                key={category._id.toString()}
                value={category._id.toString()}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        {/* Job Type */}
        <div className="form-group">
          <label
            htmlFor="jobType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Type *
          </label>
          <select
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        {/* Salary Range and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group col-span-1">
            <label
              htmlFor="salaryRange"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Salary Range
            </label>
            <input
              type="text"
              id="salaryRange"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 80,000-100,000"
            />
          </div>

          <div className="form-group col-span-1">
            <label
              htmlFor="salaryCurrency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Currency *
            </label>
            <input
              type="text"
              id="salaryCurrency"
              name="salaryCurrency"
              value={formData.salaryCurrency}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. USD"
            />
          </div>

          <div className="form-group col-span-1">
            <label
              htmlFor="salaryType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Salary Type
            </label>
            <select
              id="salaryType"
              name="salaryType"
              value={formData.salaryType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
        </div>

        {/* Job Description */}
        <div className="form-group">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the job role, responsibilities, and company..."
          ></textarea>
        </div>

        {/* Key Responsibilities */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Key Responsibilities
          </label>
          {formData.keyResponsibilities?.map((item, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange(e, index, "keyResponsibilities")
                }
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Responsibility ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, "keyResponsibilities")}
                className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("keyResponsibilities")}
            className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            + Add Responsibility
          </button>
        </div>

        {/* Requirements */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requirements
          </label>
          {formData.requirements?.map((item, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(e, index, "requirements")}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Requirement ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, "requirements")}
                className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("requirements")}
            className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            + Add Requirement
          </button>
        </div>

        {/* Benefits */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Benefits
          </label>
          {formData.benefits?.map((item, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(e, index, "benefits")}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Benefit ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, "benefits")}
                className="ml-2 px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("benefits")}
            className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            + Add Benefit
          </button>
        </div>

        {/* Application Deadline */}
        <div className="form-group">
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Application Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline?.toString().substring(0, 10) || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label
              htmlFor="contactEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Email
            </label>
            {role === "hr" ? (
              <>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. careers@company.com"
                />
              </>
            ) : (
              <select
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select HR </option>
                {hrCompanies.map((company) => (
                  <option key={company.user._id} value={company.user._id}>
                    {company.user.email}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group">
            <label
              htmlFor="contactPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contact Phone
            </label>
            <input
              type="text"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. (123) 456-7890"
            />
          </div>
        </div>

        {/* Status Selection */}
        <div className="form-group">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="open">Open (Publish Now)</option>
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Draft jobs will be saved but not publicly visible.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="form-group flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/management/jobs")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createJobApi.loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              createJobApi.loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {createJobApi.loading ? "Creating..." : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJobPage;
