import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  Button,
  Input,
  DataTable,
  Pagination,
} from "../../../components/common";
import useApiCall from "../../../hooks/useApiCall";
import jobCategoryService from "../../../services/category";
import { JobCategory, JobCategoryRequest } from "../../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  downloadCategoryCSVTemplate,
  downloadCategoriesAsCSV,
} from "../../../utils/categoryCSVHelper";

interface CategoryManagerProps {
  title?: string;
  onCategorySelect?: (category: JobCategory) => void;
  readOnly?: boolean;
  className?: string;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  title = "Manage Job Categories",
  onCategorySelect,
  readOnly = false,
  className = "",
}) => {
  // State for all categories and pagination
  const [allCategories, setAllCategories] = useState<JobCategory[]>([]);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<JobCategory | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [displayView, setDisplayView] = useState<"table" | "grid">("table");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentCategory: "", // Parent category ID
  });

  // API calls
  const getCategoriesApi = useApiCall("getJobCategories");
  const createCategoryApi = useApiCall("createJobCategory");
  const updateCategoryApi = useApiCall("updateJobCategory");
  const deleteCategoryApi = useApiCall("deleteJobCategory");
  const importCategoriesApi = useApiCall("importCategories");

  const loading = useSelector(
    (state: RootState) =>
      state.loading["getJobCategories"] ||
      state.loading["createJobCategory"] ||
      state.loading["updateJobCategory"] ||
      state.loading["deleteJobCategory"] ||
      state.loading["importCategories"]
  );

  // Get paginated data
  const getPaginatedData = () => {
    return categories;
  };

  // Fetch categories from API with pagination and search
  const fetchCategories = useCallback(
    async (page = 1, search = "") => {
      try {
        const response =
          await jobCategoryService.getJobCategoriesWithPagination(
            page,
            itemsPerPage,
            search
          );

        if (response.success && response.data) {
          setAllCategories(response.data);
          setCategories(response.data);
          setTotalPages(response.pagination.pages as number);
        }
        return response;
      } catch (error) {
        console.error("Error fetching job categories:", error);
        throw error;
      }
    },
    [itemsPerPage]
  );

  // Initial data fetch
  useEffect(() => {
    fetchCategories(currentPage, searchQuery);
  }, [currentPage, fetchCategories, searchQuery]);

  // Apply search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchCategories(1, searchQuery);
  };

  // Pagination handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // API call is triggered by the useEffect that depends on currentPage
  };

  // Handle form input
  const handleInputChange = (
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

  // Add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    await createCategoryApi.execute(async () => {
      try {
        const categoryData: JobCategoryRequest = {
          name: formData.name,
          description: formData.description,
        };

        // Add parent category if selected
        if (formData.parentCategory) {
          categoryData.parentCategory = formData.parentCategory;
        }

        const response = await jobCategoryService.createJobCategory(
          categoryData
        );

        if (response.success) {
          setFormData({
            name: "",
            description: "",
            parentCategory: "",
          });
          setShowAddForm(false);
          fetchCategories(currentPage, searchQuery);
        }

        return response;
      } catch (error) {
        console.error("Error creating job category:", error);
        throw error;
      }
    });
  };

  // Edit category
  const handleEditCategory = (category: JobCategory) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parentCategory: category.parentCategory || "",
    });
    setShowAddForm(true);
  };

  // Update category
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || !formData.name.trim()) return;

    await updateCategoryApi.execute(async () => {
      try {
        const categoryData: Partial<JobCategoryRequest> = {
          name: formData.name,
          description: formData.description,
        };

        // Add parent category if selected
        if (formData.parentCategory) {
          categoryData.parentCategory = formData.parentCategory;
        }

        const response = await jobCategoryService.updateJobCategory(
          selectedCategory._id,
          categoryData
        );

        if (response.success) {
          setFormData({
            name: "",
            description: "",
            parentCategory: "",
          });
          setSelectedCategory(null);
          setShowAddForm(false);
          fetchCategories(currentPage, searchQuery);
        }

        return response;
      } catch (error) {
        console.error("Error updating job category:", error);
        throw error;
      }
    });
  };

  // Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This may affect existing jobs."
      )
    ) {
      await deleteCategoryApi.execute(async () => {
        try {
          const response = await jobCategoryService.deleteJobCategory(
            categoryId
          );

          if (response.success) {
            fetchCategories(currentPage, searchQuery);
          }

          return response;
        } catch (error) {
          console.error("Error deleting job category:", error);
          throw error;
        }
      });
    }
  };

  // Cancel form
  const handleCancelForm = () => {
    setFormData({
      name: "",
      description: "",
      parentCategory: "",
    });
    setSelectedCategory(null);
    setShowAddForm(false);
  };

  // Handle file selection for CSV upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Create and download CSV template
  const handleDownloadTemplate = () => {
    downloadCategoryCSVTemplate();
  };

  // Export categories to CSV
  const handleExportCSV = () => {
    downloadCategoriesAsCSV(categories, "categories-export.csv");
  };

  // Handle CSV import
  const handleImportCSV = async () => {
    if (!selectedFile) return;

    await importCategoriesApi.execute(async () => {
      try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await jobCategoryService.importCategoriesFromCSV(
          formData
        );

        if (response.success) {
          setImportResults({
            success: response.data?.successCount || 0,
            failed: response.data?.failedCount || 0,
          });

          if (response.data?.failedCount && response.data?.failedCount > 0) {
            alert(
              "Some categories failed to import. Possible reasons include:\n" +
                "- Parent category doesn't exist\n" +
                "- Parent category appears after its children in the CSV\n" +
                "- Category name already exists\n\n" +
                "Please ensure parent categories are listed before their children in the CSV file."
            );
          }

          fetchCategories(currentPage, searchQuery);
        }

        return response;
      } catch (error) {
        console.error("Error importing categories:", error);
        throw error;
      } finally {
        setSelectedFile(null);
        const fileInput = document.getElementById(
          "csvFileInput"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    });
  };

  // Toggle view between table and grid
  const toggleView = () => {
    setDisplayView((prev) => (prev === "table" ? "grid" : "table"));
  };

  // Get parent categories (top-level only for dropdown) - memoized to avoid recalculation
  const parentCategoryOptions = useMemo(
    () => allCategories.filter((category) => !category.parentCategory),
    [allCategories]
  );

  // Get the parent category name for display - memoized
  const getParentCategoryName = useCallback(
    (parentId?: string) => {
      if (!parentId) return "";
      const parent = allCategories.find((cat) => cat._id === parentId);
      return parent ? parent.name : "";
    },
    [allCategories]
  );

  // DataTable columns with proper typing
  const columns = [
    {
      id: "name",
      header: "Name",
      accessor: "name",
    },
    {
      id: "parent",
      header: "Parent Category",
      accessor: (row: Record<string, unknown>) => {
        const category = row as unknown as JobCategory;
        return category.parentCategory
          ? getParentCategoryName(category.parentCategory)
          : "-";
      },
    },
    {
      id: "description",
      header: "Description",
      accessor: (row: Record<string, unknown>) => {
        const category = row as unknown as JobCategory;
        return category.description || "-";
      },
    },
    {
      id: "actions",
      header: "Actions",
      accessor: (row: Record<string, unknown>) => {
        const category = row as unknown as JobCategory;
        return (
          <div className="flex gap-2">
            {onCategorySelect && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCategorySelect(category);
                }}
              >
                Select
              </Button>
            )}
            {!readOnly && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCategory(category);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category._id);
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  // Handle row click
  const handleRowClick = (category: JobCategory) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  return (
    <div className={`container mx-auto p-4 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <div className="flex gap-3">
          {!readOnly && (
            <>
              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Template
              </Button>

              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export CSV
              </Button>

              <Button
                variant="primary"
                onClick={() => setShowAddForm(true)}
                disabled={showAddForm}
                className="flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Category
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onClick={toggleView}
            className="flex items-center gap-2"
          >
            {displayView === "table" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            )}
            {displayView === "table" ? "Grid View" : "Table View"}
          </Button>
        </div>
      </div>
      {/* Import CSV section - only show if not readOnly */}
      {!readOnly && (
        <Card className="mb-6 p-4">
          <h2 className="text-lg font-semibold mb-3">
            Import Categories from CSV
          </h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
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
            <Button
              variant="primary"
              onClick={handleImportCSV}
              disabled={!selectedFile || loading}
              className="whitespace-nowrap"
            >
              {loading ? "Importing..." : "Import CSV"}
            </Button>
          </div>

          {importResults && (
            <div
              className={`mt-4 p-3 rounded ${
                importResults.failed === 0
                  ? "bg-green-50 text-green-800"
                  : "bg-yellow-50 text-yellow-800"
              }`}
            >
              <p>
                Successfully imported {importResults.success} categories.
                {importResults.failed > 0 &&
                  ` Failed to import ${importResults.failed} categories.`}
              </p>
            </div>
          )}
        </Card>
      )}
      {/* Add/Edit Category Form - only show if not readOnly */}
      {!readOnly && showAddForm && (
        <Card className="mb-6 p-4">
          <h2 className="text-lg font-semibold mb-3">
            {selectedCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <form
            onSubmit={
              selectedCategory ? handleUpdateCategory : handleAddCategory
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  name="parentCategory"
                  value={formData.parentCategory}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">None (Top Level)</option>
                  {parentCategoryOptions.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter category description"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelForm}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading
                  ? selectedCategory
                    ? "Updating..."
                    : "Adding..."
                  : selectedCategory
                  ? "Update Category"
                  : "Add Category"}
              </Button>
            </div>
          </form>
        </Card>
      )}
      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>
      {/* Loading state */}
      {loading && !showAddForm && (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      )}
      {/* Error state */}
      {getCategoriesApi.error && (
        <div className="bg-red-100 p-4 rounded-md mb-6">
          <p className="text-red-700">Error: {getCategoriesApi.error}</p>
        </div>
      )}
      {/* Categories display - Table or Grid view */}
      {!loading && (
        <>
          {!categories || categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No categories found.{" "}
                {!readOnly && "Add a new category to get started."}
              </p>
            </div>
          ) : displayView === "table" ? (
            // Cast data to satisfy TypeScript
            <DataTable
              columns={columns}
              data={getPaginatedData() as unknown as Record<string, unknown>[]}
              keyExtractor={(item) => (item as unknown as JobCategory)._id}
              onRowClick={
                onCategorySelect
                  ? (item) => handleRowClick(item as unknown as JobCategory)
                  : undefined
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getPaginatedData().map((category) => (
                <Card
                  key={category._id}
                  className={`p-4 ${
                    onCategorySelect ? "cursor-pointer hover:shadow-md" : ""
                  }`}
                >
                  <div
                    className="flex justify-between"
                    onClick={
                      onCategorySelect
                        ? () => handleRowClick(category)
                        : undefined
                    }
                  >
                    <div>
                      <h2 className="text-xl font-semibold">{category.name}</h2>
                      {category.parentCategory && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                          Parent:{" "}
                          {getParentCategoryName(category.parentCategory)}
                        </span>
                      )}
                      {category.description && (
                        <p className="text-gray-600 mt-2 text-sm">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {onCategorySelect && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCategorySelect(category);
                          }}
                        >
                          Select
                        </Button>
                      )}
                      {!readOnly && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCategory(category);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category._id);
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      {/* Pagination */}
      {!loading && categories.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CategoryManager;
