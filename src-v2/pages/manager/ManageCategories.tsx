import { useEffect, useState } from "react";
import { Button, Input, Confirm } from "../../components/common";
import { DataTable } from "../../components/common";
import { Category } from "../../types/category.types";
import { useCategory } from "../../hooks/useCategory";
import { Column } from "../../components/common/DataTable";
import { CategoryForm } from "./CategoryForm";
import Papa from "papaparse";
import { useDispatch } from "react-redux";
import {
  clearCurrentCategory,
  setCurrentCategory,
} from "../../redux/slices/categorySlice";
import { useAppSelector } from "../../redux/store";
import { Pagination } from "@mui/material";
import { setPage } from "../../redux/slices/paginationSlice";
import { ImportCsv } from "../../components/common/ImportCsv";
export const ManageCategories = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { page, limit, totalPages } = useAppSelector(
    (state) => state.pagination
  );

  const {
    categories,
    currentCategory,
    getCategories,
    deleteCategory,
    importCategories,
    searchCategories,
  } = useCategory();

  useEffect(() => {
    getCategories(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleSubmit = () => {
    getCategories(page, limit);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!currentCategory?._id) return;
    try {
      await deleteCategory(currentCategory._id);
      getCategories(page, limit);
      setShowDeleteConfirm(false);
      dispatch(clearCurrentCategory());
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleImport = async (file: File) => {
    try {
      await importCategories(file);
      setShowImportModal(false);
    } catch (error) {
      console.error("Error importing categories:", error);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: "Example Category",
        description: "Example Description",
        parentCategory: "parentCategory",
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "categories_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      id: "name",
      header: "Name",
      accessor: "name",
    },
    {
      id: "description",
      header: "Description",
      accessor: "description",
    },
    {
      id: "parentCategory",
      header: "Parent",
      accessor: "parentCategory",
      render: (record: Category | string | null) => {
        if (record === null) return "";
        const parent = categories.find((cat) => cat._id === record);
        return parent ? parent.name : "";
      },
    },
    {
      id: "actions",
      header: "Actions",
      accessor: "actions",
      render: (record: Category) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setCurrentCategory(record));
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setCurrentCategory(record));
              setShowDeleteConfirm(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search categories..."
            onChange={(e) => {
              setTimeout(() => {
                searchCategories(e.target.value, page, limit);
              }, 1000);
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              dispatch(clearCurrentCategory());
              setIsModalOpen(true);
            }}
          >
            Add Category
          </Button>
          <Button onClick={() => setShowImportModal(true)}>
            Import Categories
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={categories as unknown as Record<string, unknown>[]}
        onRowClick={() => {}}
        isLoading={false}
      />
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, newPage) => dispatch(setPage(newPage))}
      />

      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          dispatch(clearCurrentCategory());
        }}
        onSubmit={handleSubmit}
      />

      <ImportCsv
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSubmit={handleImport}
        onDownloadTemplate={downloadTemplate}
        title="Categories"
      />

      <Confirm
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          dispatch(clearCurrentCategory());
        }}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </>
  );
};
