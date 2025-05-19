import { useEffect, useState } from "react";
import { DataTable, Modal } from "../../components/common";
import { Button } from "../../components/common";
import { Input } from "../../components/common";
import { JobPost } from "../../types/job.types";
import { JobForm } from "./JobForm";
import { useJobs } from "../../hooks/useJobs";
import { useAuth } from "../../hooks/useAuth";
import jobService from "../../services/jobService";

export const ManageJobs = () => {
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const { id, role, useProfileId } = useAuth();
  const { getCompanyJobs, getHrJobs, jobs } = useJobs();
  useEffect(() => {
    if (role === "company" && useProfileId) {
      getCompanyJobs(useProfileId);
    } else if (role === "staff" && useProfileId) {
      getHrJobs(useProfileId);
    }
  }, [getCompanyJobs, getHrJobs, role, useProfileId]);
  const columns = [
    {
      id: "title",
      header: "Title",
      accessor: "title",
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
      render: (row: JobPost) => {
        return row?.profile?.email;
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
      id: "actions",
      header: "Actions",
      accessor: "actions",
    },
  ];
  const { createJob } = useJobs();
  const handleAddJob = (job: JobPost) => {
    createJob({
      ...job,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportJobs = async () => {
    if (!selectedFile || !useProfileId) return;

    try {
      const response = await jobService.importJobsFromCSV(
        selectedFile,
        useProfileId
      );

      if (response.success) {
        if (role === "company") {
          getCompanyJobs(useProfileId);
        } else if (role === "staff") {
          getHrJobs(useProfileId);
        }
      }
    } catch (error) {
      console.error("Error importing jobs:", error);
    } finally {
      const fileInput = document.getElementById(
        "csvFileInput"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      setSelectedFile(null);
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
      "Hanoi, Vietnam",
      "Full-time",
      "Mid-level",
      "800",
      "1500",
      "USD",
      "JavaScript;React;HTML;CSS",
      "Open",
      "Health insurance;Flexible hours;Remote work",
      "hr@example.com",
      "true",
      "3+ years experience with React;Familiarity with REST APIs",
      "Build and maintain UI components;Collaborate with backend team",
      "IT",
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
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Input placeholder="Search" />
          <Button>Search</Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddJobModalOpen(true)}>Add Job</Button>
          <Button onClick={downloadTemplate}>Template</Button>
          <Button onClick={() => setShowImportModal(true)}>Import Job</Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={jobs as unknown as Record<string, unknown>[]}
        onRowClick={() => {}}
        isLoading={false}
      />
      <JobForm
        isOpen={isAddJobModalOpen}
        onClose={() => setIsAddJobModalOpen(false)}
        onSubmit={handleAddJob}
        contacterId={id as string}
        isCompanyUser={true}
      />

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title={`Import Jobs from CSV`}
        size="md"
        footer={
          <div className="flex gap-2">
            <Button
              onClick={() => setShowImportModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-400  hover:bg-gray-500 rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportJobs}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Import
            </Button>
          </div>
        }
      >
        <input
          type="file"
          id="csvFileInput"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
        />
      </Modal>
    </>
  );
};
