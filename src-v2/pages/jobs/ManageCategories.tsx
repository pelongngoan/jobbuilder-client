import React from "react";
import { ManagementLayout } from "../../components/layouts";
import { ActionButton, DownloadIcon } from "../../components/manager";
import CategoryManager from "../../features/jobs/components/CategoryManager";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useApiCall from "../../hooks/useApiCall";
import {
  downloadCategoryCSVTemplate,
  downloadCategoriesAsCSV,
} from "../../utils/categoryCSVHelper";

const ManageCategories: React.FC = () => {
  // Loading state from the CategoryManager component's API calls
  const loading = useSelector(
    (state: RootState) =>
      state.loading["getJobCategories"] ||
      state.loading["createJobCategory"] ||
      state.loading["updateJobCategory"] ||
      state.loading["deleteJobCategory"] ||
      state.loading["importCategories"]
  );

  // Error state from the API calls
  const getCategoriesApi = useApiCall("getJobCategories");

  // Define action buttons for the management layout
  const actionButtons = (
    <>
      <ActionButton
        label="Template"
        icon={<DownloadIcon />}
        variant="outline"
        onClick={downloadCategoryCSVTemplate}
      />
      <ActionButton
        label="Export CSV"
        icon={<DownloadIcon />}
        variant="outline"
        onClick={() => downloadCategoriesAsCSV([], "categories-export.csv")}
      />
    </>
  );

  return (
    <ManagementLayout
      title="Manage Job Categories"
      actions={actionButtons}
      loading={loading}
      error={getCategoriesApi.error}
    >
      <CategoryManager />
    </ManagementLayout>
  );
};

export default ManageCategories;
