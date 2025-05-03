import React from "react";

/**
 * Column definition interface
 */
interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  align?: "left" | "right";
  render?: (row: T) => React.ReactNode;
}

/**
 * DataTable component props
 */
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  keyField?: keyof T | string;
}

/**
 * Reusable DataTable component
 *
 * @template T The type of data being displayed
 */
export const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data available",
  keyField = "id",
}: DataTableProps<T>): React.ReactElement => {
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={String(row[keyField as keyof T])}
                className={`hover:bg-gray-50 ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`px-6 py-4 whitespace-nowrap ${
                      column.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

/**
 * TablePagination component props
 */
interface TablePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
}

/**
 * Pagination component for the DataTable
 */
export const TablePagination: React.FC<TablePaginationProps> = ({
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange = () => {},
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium">
          {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
        </span>
        {" - "}
        <span className="font-medium">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{" "}
        of <span className="font-medium">{totalItems}</span> items
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Previous
        </button>

        {/* This is a simplified pagination UI, could be expanded to show more page numbers */}
        <button className="px-3 py-1 border rounded bg-blue-50 border-blue-500 text-blue-600 text-sm">
          {currentPage}
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
