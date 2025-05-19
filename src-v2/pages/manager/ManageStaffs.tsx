import { Button, Input, Select } from "../../components/common";
import DataTable from "../../components/common/DataTable";
import { useEffect, useState } from "react";
import { useStaff } from "../../hooks/useStaff";
import { RootState, useAppSelector } from "../../redux/store";
import staffService from "../../services/staff";
import companyService from "../../services/company";
import { StaffForm } from "./StaffForm";

interface CompanyStaff extends Record<string, unknown> {
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
  id: string;
}

export const ManageStaffs = () => {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isImportStaffModalOpen, setIsImportStaffModalOpen] = useState(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false);
  const [isDeleteStaffModalOpen, setIsDeleteStaffModalOpen] = useState(false);
  const [isViewStaffModalOpen, setIsViewStaffModalOpen] = useState(false);
  const { staffs, getStaffs, createStaff } = useStaff();
  const { staffs: companyStaffs } = useAppSelector(
    (state: RootState) => state.staff
  );

  useEffect(() => {
    getStaffs();
  }, []);

  const handleAddStaff = async (formData: {
    fullName: string;
    active: boolean;
    password: string;
    role: string;
  }) => {
    await createStaff(formData);
  };

  const handleToggleActive = async (
    staffId: string,
    currentActive: boolean
  ) => {
    try {
      await companyService.updateCompanyStaffActive({
        ids: [staffId],
        active: !currentActive,
      });
      getStaffs();
    } catch (error) {
      console.error("Failed to toggle staff status:", error);
    }
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
      id: "createdAt",
      header: "Created At",
      accessor: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      accessor: "id",
      render: (value: string, row: CompanyStaff) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActive(value, row.active);
          }}
          className={`${
            row.active ? "bg-red-500" : "bg-green-500"
          } text-white px-3 py-1 rounded`}
        >
          {row.active ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Input placeholder="Search" />
          <Button>Search</Button>
          <Select
            options={[
              { label: "All", value: "all" },
              { label: "HR", value: "hr" },
              { label: "Interviewer", value: "interviewer" },
            ]}
            onChange={(value) => {
              console.log(value);
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddStaffModalOpen(true)}>
            Add Staff
          </Button>
          <Button>Import Staff</Button>
        </div>
      </div>
      <DataTable<CompanyStaff>
        columns={columns}
        data={companyStaffs.map((staff) => ({
          email: staff.userId.email,
          role: staff.role,
          active: staff.active,
          createdAt: staff.createdAt,
          id: staff.id,
        }))}
        keyExtractor={(item) => item.email}
        onRowClick={() => {}}
        isLoading={false}
      />
      <StaffForm
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        onSubmit={handleAddStaff}
        status="add"
      />
    </>
  );
};
