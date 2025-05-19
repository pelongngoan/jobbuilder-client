import React, { useEffect, useState } from "react";
import { Button, Input } from "../../components/common";
import { DataTable, Modal } from "../../components/common";
import { Category } from "../../types/category.types";
import { useCategory } from "../../hooks/usecategory";
import { Column } from "../../components/common/DataTable";
import { useAppDispatch } from "../../redux/store";
import { setCurrentCategory } from "../../redux/slices/categorySlice";
export const ManageCategories = () => {
  const dispatch = useAppDispatch();

  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const { categories, getCategories } = useCategory();
  useEffect(() => {
    getCategories();
  }, []);
  const colums = [
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
    },
    {
      id: "actions",
      header: "Actions",
      accessor: "actions",
      render: (text: string, record: Category) => (
        <Button
          onClick={() => {
            setIsAddJobModalOpen(true);
            dispatch(setCurrentCategory(record));
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  const handleImportJobs = () => {
    console.log("Import Jobs");
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File changed");
  };
  const downloadTemplate = () => {
    console.log("Download Template");
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
        columns={colums as Column<Record<string, unknown>>[]}
        data={categories as unknown as Record<string, unknown>[]}
        onRowClick={() => {}}
        isLoading={false}
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
