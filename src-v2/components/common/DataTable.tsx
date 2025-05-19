import React, { ReactNode } from "react";

export interface Column<T> {
  id: string;
  header: string | ReactNode;
  accessor: keyof T | ((row: T) => ReactNode);
  render?: (value: any, row: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const DataTable = <T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading = false,
  emptyMessage = "No data available",
  className = "",
}: DataTableProps<T>) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const getCellValue = (item: T, column: Column<T>): ReactNode => {
    // First get the raw value
    let value;
    if (typeof column.accessor === "function") {
      value = column.accessor(item);
    } else {
      value = item[column.accessor as keyof T];
    }

    // Then apply render function if it exists
    if (column.render) {
      return column.render(value, item);
    }

    // Handle null/undefined
    if (value === null || value === undefined) {
      return "";
    }

    // Handle objects
    if (typeof value === "object" && !React.isValidElement(value)) {
      return JSON.stringify(value);
    }

    return value as ReactNode;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  column.className || ""
                }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => {
            const key = keyExtractor ? keyExtractor(item) : index.toString();
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
              >
                {columns.map((column) => (
                  <td
                    key={`${key}-${column.id}`}
                    className={`px-6 py-4 whitespace-nowrap ${
                      column.className || ""
                    }`}
                  >
                    {getCellValue(item, column)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
