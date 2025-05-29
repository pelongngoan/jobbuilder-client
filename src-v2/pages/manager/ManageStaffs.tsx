import { Button, Input, Select } from "../../components/common";
import DataTable from "../../components/common/DataTable";
import { useEffect, useState } from "react";
import { useStaff } from "../../hooks/useStaff";
import { StaffForm } from "./StaffForm";
import { ImportCsv } from "../../components/common/ImportCsv";
import { Pagination } from "@mui/material";
import { setPage } from "../../redux/slices/paginationSlice";
import { useAppDispatch } from "../../redux/store";
import { useAppSelector } from "../../redux/store";
import { setCurrentStaff } from "../../redux/slices/staffSlice";
import Papa from "papaparse";
import { StaffProfile } from "../../types/staff.types";
import { User } from "../../types/user.types";
export const ManageStaffs = () => {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isImportStaffModalOpen, setIsImportStaffModalOpen] = useState(false);
  const {
    staffs,
    getStaffs,
    deleteStaff,
    importStaffs,
    searchStaffs,
    getStaffById,
    updateStaff,
  } = useStaff();
  const { page, limit, totalPages } = useAppSelector(
    (state) => state.pagination
  );
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<"add" | "edit">("add");
  const dispatch = useAppDispatch();

  useEffect(() => {
    getStaffs(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleImportStaff = async (file: File) => {
    importStaffs(file);
  };
  const handleCloseAddStaffModal = () => {
    setIsAddStaffModalOpen(false);
  };

  const handleCloseImportStaffModal = () => {
    setIsImportStaffModalOpen(false);
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        firstName: "Dũng",
        lastName: "Nguyễn Tiến",
        role: "hr",
        active: true,
      },
    ];
    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "staffs_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      id: "email",
      header: "Email",
      accessor: "email",
    },
    {
      id: "role",
      header: "Role",
      accessor: "role",
    },
    {
      id: "active",
      header: "Status",
      accessor: "active",
      render: (value: boolean) => (
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              value ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span>{value ? "Active" : "Inactive"}</span>
        </div>
      ),
    },
    {
      id: "jobPosts",
      header: "Number Of Job Posts",
      accessor: "jobPosts",
      render: (jobPosts: any) => {
        return 0;
      },
    },
    {
      id: "applications",
      header: "Number Of Applications",
      accessor: "applications",
      render: (applications: any) => {
        return 0;
      },
    },
    {
      id: "createdAt",
      header: "Created At",
      accessor: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {},
    {
      id: "id",
      header: "Actions",
      accessor: "id",
      render: (value: string, row: StaffProfile) => (
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              getStaffById(value);
              setStatus("edit");
              setIsAddStaffModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              updateStaff(value, {
                active: !row.active,
              }).then(() => {
                getStaffs(page, limit);
              });
            }}
            className={`${
              row.active ? "bg-red-500" : "bg-green-500"
            } text-white px-3 py-1 rounded`}
          >
            {row.active ? "Deactivate" : "Activate"}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              deleteStaff(value).then(() => {
                getStaffs(page, limit);
              });
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col flex-1 m-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search"
            onChange={(e) => {
              setEmail(e.target.value);
              setTimeout(() => {
                searchStaffs(e.target.value, role, page, limit);
              }, 1000);
            }}
          />
          <Select
            options={[
              { label: "All", value: "all" },
              { label: "HR", value: "hr" },
              { label: "Interviewer", value: "interviewer" },
            ]}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const value = e.target.value;
              if (value === "all") {
                searchStaffs(email, "", page, limit);
              } else {
                setRole(value);
                searchStaffs(email, value, page, limit);
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setStatus("add");
              dispatch(setCurrentStaff(null));
              setIsAddStaffModalOpen(true);
            }}
          >
            Add Staff
          </Button>
          <Button
            onClick={() => {
              setIsImportStaffModalOpen(true);
            }}
          >
            Import Staff
          </Button>
        </div>
      </div>
      <DataTable<StaffProfile>
        columns={columns as Column<StaffProfile>[]}
        data={staffs.map((staff) => {
          return {
            email: (staff.userId as User).email,
            role: staff.role,
            active: staff.active || false,
            jobPosts: staff.jobPosts || 0,
            applications: staff.applications || 0,
            createdAt: staff.createdAt || new Date(),
            id: staff._id,
          };
        })}
      />
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, newPage) => dispatch(setPage(newPage))}
      />
      <StaffForm
        isOpen={isAddStaffModalOpen}
        onClose={handleCloseAddStaffModal}
        status={status}
      />
      <ImportCsv
        isOpen={isImportStaffModalOpen}
        onClose={handleCloseImportStaffModal}
        onSubmit={handleImportStaff}
        onDownloadTemplate={handleDownloadTemplate}
        title="Staff"
      />
    </div>
  );
};
