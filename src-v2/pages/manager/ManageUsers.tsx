import { useEffect, useState } from "react";
import { Button, Input, Confirm } from "../../components/common";
import { DataTable } from "../../components/common";
import { User, UserRole } from "../../types";
import { useUser } from "../../hooks/useUser";
import { Column } from "../../components/common/DataTable";
import { UserForm } from "./UserForm";
import Papa from "papaparse";
import { useDispatch } from "react-redux";
import { clearCurrentUser, setCurrentUser } from "../../redux/slices/userSlice";
import { useAppSelector } from "../../redux/store";
import { Pagination } from "@mui/material";
import { setPage } from "../../redux/slices/paginationSlice";
import { ImportCsv } from "../../components/common/ImportCsv";
import { Chip } from "@mui/material";

export const ManageUsers = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { page, limit, totalPages } = useAppSelector(
    (state) => state.pagination
  );

  const { users, currentUser, getUsers, deleteUser, importUser, searchUsers } =
    useUser();

  useEffect(() => {
    getUsers(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleSubmit = () => {
    getUsers(page, limit);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!currentUser?._id) return;
    try {
      await deleteUser(currentUser._id);
      getUsers(page, limit);
      setShowDeleteConfirm(false);
      dispatch(clearCurrentUser());
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleImport = async (file: File) => {
    try {
      await importUser(file);
      setShowImportModal(false);
      getUsers(page, limit);
    } catch (error) {
      console.error("Error importing users:", error);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        email: "example@email.com",
        password: "password123",
        role: "user",
        isVerified: true,
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "users_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleColor = (role: UserRole) => {
    const colors = {
      admin: "error",
      staff: "warning",
      company: "success",
      user: "primary",
    };
    return colors[role] as "error" | "warning" | "success" | "primary";
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
      render: (role: UserRole) => (
        <Chip label={role} color={getRoleColor(role)} size="small" />
      ),
    },
    {
      id: "isVerified",
      header: "Status",
      accessor: "isVerified",
      render: (isVerified: boolean) => (
        <Chip
          label={isVerified ? "Verified" : "Not Verified"}
          color={isVerified ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      id: "lastLogin",
      header: "Last Login",
      accessor: "lastLogin",
      render: (date: Date | undefined) =>
        date ? new Date(date).toLocaleDateString() : "Never",
    },
    {
      id: "_id",
      header: "Actions",
      accessor: "_id",
      render: (record: string) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  setCurrentUser(users.find((u) => u._id === record) as User)
                );
                setIsModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  setCurrentUser(users.find((u) => u._id === record) as User)
                );
                setShowDeleteConfirm(true);
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search users..."
            onChange={(e) => {
              setTimeout(() => {
                searchUsers(e.target.value, page, limit);
              }, 1000);
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              dispatch(clearCurrentUser());
              setIsModalOpen(true);
            }}
          >
            Add User
          </Button>
          <Button onClick={() => setShowImportModal(true)}>Import Users</Button>
        </div>
      </div>

      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={users as unknown as Record<string, unknown>[]}
        onRowClick={() => {}}
        isLoading={false}
      />
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, newPage) => dispatch(setPage(newPage))}
      />

      <UserForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          dispatch(clearCurrentUser());
        }}
        onSubmit={handleSubmit}
      />

      <ImportCsv
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSubmit={handleImport}
        onDownloadTemplate={downloadTemplate}
        title="Users"
      />

      <Confirm
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          dispatch(clearCurrentUser());
        }}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </>
  );
};
