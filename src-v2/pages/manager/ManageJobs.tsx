import { useEffect, useState } from "react";
import { DataTable } from "../../components/common";
import { Button } from "../../components/common";
import { Input } from "../../components/common";
import { JobPost } from "../../types/job.types";
import { JobForm } from "./JobForm";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "../../hooks/useAuth";
import jobService from "../../services/jobService";
import { Category } from "../../types/category.types";
import { ImportCsv } from "../../components/common/ImportCsv";
import { useAppSelector } from "../../redux/store";
import { setPage } from "../../redux/slices/paginationSlice";
import { Pagination } from "@mui/material";
import { useDispatch } from "react-redux";

export const ManageJobs = () => {
  const dispatch = useDispatch();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const { role, useProfileId } = useAuth();
  const { getCompanyJobs, getHrJobs, jobs, getJobById, deleteJob, searchJobs } =
    useJobs();
  const { page, limit, totalPages } = useAppSelector(
    (state) => state.pagination
  );

  const columns = [
    {
      id: "title",
      header: "Title",
      accessor: "title",
    },
    {
      id: "category",
      header: "Category",
      accessor: "category",
      render: (value: unknown) => {
        const category = value as Category;
        return category?.name;
      },
    },
    {
      id: "salaryFrom",
      header: "Salary From",
      accessor: "salaryFrom",
    },
    {
      id: "salaryTo",
      header: "Salary To",
      accessor: "salaryTo",
    },
    {
      id: "salaryCurrency",
      header: "Salary Currency",
      accessor: "salaryCurrency",
    },
    {
      id: "contacterId",
      header: "Contacter Email",
      accessor: "contacterId",
      render: (_value: unknown, row: Record<string, unknown>) => {
        const jobPost = row as unknown as JobPost;
        return jobPost?.profile?.email;
      },
    },
    {
      id: "applicationCount",
      header: "Number of Applicants",
      accessor: "applicationCount",
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
    },
    {
      id: "createdAt",
      header: "Created At",
      accessor: "createdAt",
    },
    {
      id: "_id",
      header: "Actions",
      accessor: "_id",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      render: (value: unknown, _row: Record<string, unknown>) => {
        const jobId = value as string;
        return (
          <div className="flex gap-2">
            <Button onClick={() => handleEditJob(jobId)} size="sm">
              Edit
            </Button>
            <Button
              onClick={() => handleDeleteJob(jobId)}
              size="sm"
              variant="danger"
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
  const handleDeleteJob = async (job: string) => {
    await deleteJob(job).then(() => {
      if (role === "company" && useProfileId) {
        getCompanyJobs(useProfileId, page, limit);
      } else if (role === "staff" && useProfileId) {
        getHrJobs(useProfileId, page, limit);
      }
    });
  };
  useEffect(() => {
    if (role === "company" && useProfileId) {
      getCompanyJobs(useProfileId, page, limit);
    } else if (role === "staff" && useProfileId) {
      getHrJobs(useProfileId, page, limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, useProfileId, page, limit]);
  const handleEditJob = async (job: string) => {
    getJobById(job);
    setIsJobModalOpen(true);
  };

  const handleImportJobs = async (file: File) => {
    if (!file || !useProfileId) return;

    try {
      const response = await jobService.importJobsFromCSV(file, useProfileId);
      if (response.success) {
        if (role === "company") {
          getCompanyJobs(useProfileId, page, limit);
        } else if (role === "staff") {
          getHrJobs(useProfileId, page, limit);
        }
      }
    } catch (error) {
      console.error("Error importing jobs:", error);
    } finally {
      const fileInput = document.getElementById(
        "csvFileInput"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "Title",
      "Description",
      "Location",
      "Job Type",
      "Experience Level",
      "Salary From",
      "Salary To",
      "Salary Currency",
      "Skills",
      "Status",
      "Benefits",
      "Contact Email",
      "Is Featured",
      "Requirements",
      "Key Responsibilities",
      "Category",
      "Deadline",
    ].join(",");

    const sampleData = [
      "Frontend Developer",
      "Responsible for developing and maintaining web interfaces using React.js",
      "Cau Giay",
      "full-time",
      "Mid",
      "800",
      "1500",
      "USD",
      "JavaScript;React;HTML;CSS",
      "open",
      "Health insurance;Flexible hours;Remote work",
      "hr@example.com",
      "true",
      "3+ years experience with React;Familiarity with REST APIs",
      "Build and maintain UI components;Collaborate with backend team",
      "Information Technology",
      "2025-06-30",
    ].join(",");

    const csvContent = `${headers}\n${sampleData}`;

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "jobs-import-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col flex-1 m-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            onChange={(e) =>
              searchJobs({
                title: e.target.value,
                page,
                limit,
              })
            }
          />
          <Button>Search</Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsJobModalOpen(true)}>Add Job</Button>
          <Button onClick={() => setShowImportModal(true)}>Import Job</Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={jobs as unknown as Record<string, unknown>[]}
        onRowClick={() => {}}
        isLoading={false}
      />
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, value) => dispatch(setPage(value))}
      />
      <JobForm
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        contacterId={useProfileId as string}
        isCompany={role === "company"}
      />

      {/* Import Modal */}
      <ImportCsv
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSubmit={handleImportJobs}
        onDownloadTemplate={downloadTemplate}
        title="Jobs"
      />
    </div>
  );
};
