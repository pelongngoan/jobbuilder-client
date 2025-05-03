import React, { useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { DataTable, TablePagination } from "../../components/DataTable";

// Define HR Account interface
interface HrAccount {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  jobsManaged: number;
  dateAdded: string;
}

// Define column interface
interface Column {
  key: keyof HrAccount | "actions";
  header: string;
  align?: "left" | "right";
  render: (hr: HrAccount) => React.ReactNode;
}

// Mock data for HR accounts
const initialHrData: HrAccount[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "Senior HR",
    status: "active",
    jobsManaged: 8,
    dateAdded: "Jan 15, 2025",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.c@company.com",
    role: "HR Manager",
    status: "active",
    jobsManaged: 12,
    dateAdded: "Nov 3, 2024",
  },
  {
    id: 3,
    name: "Priya Patel",
    email: "priya.p@company.com",
    role: "Junior HR",
    status: "active",
    jobsManaged: 4,
    dateAdded: "Feb 20, 2025",
  },
  {
    id: 4,
    name: "Robert Wilson",
    email: "robert.w@company.com",
    role: "HR Assistant",
    status: "inactive",
    jobsManaged: 0,
    dateAdded: "Dec 12, 2024",
  },
  {
    id: 5,
    name: "Lisa Taylor",
    email: "lisa.t@company.com",
    role: "Senior HR",
    status: "active",
    jobsManaged: 6,
    dateAdded: "Oct 5, 2024",
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.k@company.com",
    role: "HR Manager",
    status: "active",
    jobsManaged: 9,
    dateAdded: "Mar 15, 2025",
  },
];

// Define role options type for proper typing
type RoleOption = "HR Manager" | "Senior HR" | "Junior HR" | "HR Assistant";

// List of available roles
const roleOptions: RoleOption[] = [
  "HR Manager",
  "Senior HR",
  "Junior HR",
  "HR Assistant",
];

export const HrManagementPage: React.FC = () => {
  const [hrData, setHrData] = useState<HrAccount[]>(initialHrData);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentHr, setCurrentHr] = useState<HrAccount | null>(null);

  // Filter data based on search term and status filter
  const filteredData = hrData.filter((hr) => {
    const matchesSearch =
      hr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hr.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || hr.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateHr = (): void => {
    setCurrentHr(null);
    setShowModal(true);
  };

  const handleEditHr = (hr: HrAccount): void => {
    setCurrentHr(hr);
    setShowModal(true);
  };

  const handleToggleStatus = (id: number): void => {
    setHrData(
      hrData.map((hr) => {
        if (hr.id === id) {
          return {
            ...hr,
            status: hr.status === "active" ? "inactive" : "active",
          };
        }
        return hr;
      })
    );
  };

  const tableColumns: Column[] = [
    {
      key: "name",
      header: "Name",
      render: (hr) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
              {hr.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{hr.name}</div>
            <div className="text-sm text-gray-500">{hr.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (hr) => <span className="text-sm text-gray-500">{hr.role}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (hr) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            hr.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {hr.status}
        </span>
      ),
    },
    {
      key: "jobsManaged",
      header: "Jobs Managed",
      render: (hr) => (
        <span className="text-sm text-gray-500">{hr.jobsManaged}</span>
      ),
    },
    {
      key: "dateAdded",
      header: "Date Added",
      render: (hr) => (
        <span className="text-sm text-gray-500">{hr.dateAdded}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (hr) => (
        <div className="flex justify-end space-x-2">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleToggleStatus(hr.id);
            }}
            className={`p-1 rounded-full ${
              hr.status === "active"
                ? "text-red-600 hover:bg-red-100"
                : "text-green-600 hover:bg-green-100"
            }`}
          >
            {hr.status === "active" ? (
              <UserX className="h-5 w-5" />
            ) : (
              <UserCheck className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleEditHr(hr);
            }}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="p-1 text-red-600 hover:bg-red-100 rounded-full"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">HR Accounts</h1>
        <button
          onClick={handleCreateHr}
          className="bg-blue-600 text-white flex items-center px-4 py-2 rounded"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create HR Account
        </button>
      </div>

      {/* Search and filter bar */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <div className="flex space-x-4">
          <div>
            <select
              className="border rounded p-2"
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive")
              }
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <select className="border rounded p-2">
              <option value="">All Roles</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* HR accounts table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <DataTable<HrAccount>
          columns={tableColumns}
          data={filteredData}
          emptyMessage="No HR accounts found matching your filters."
          keyField="id"
        />
      </div>

      {/* Pagination */}
      <TablePagination
        totalItems={filteredData.length}
        itemsPerPage={10}
        currentPage={1}
        onPageChange={(page: number) => console.log(`Changed to page ${page}`)}
      />

      {/* Modal for creating/editing HR account */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentHr ? "Edit HR Account" : "Create HR Account"}
            </h2>
            <form
              className="space-y-4"
              onSubmit={(e: React.FormEvent) => e.preventDefault()}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  defaultValue={currentHr?.name || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  defaultValue={currentHr?.email || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="w-full p-2 border rounded"
                  defaultValue={currentHr?.role || ""}
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      defaultChecked={
                        currentHr?.status === "active" || !currentHr
                      }
                    />
                    <span className="ml-2">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      defaultChecked={currentHr?.status === "inactive"}
                    />
                    <span className="ml-2">Inactive</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
