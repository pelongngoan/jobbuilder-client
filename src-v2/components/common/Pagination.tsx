import React from "react";
import { Button } from "./";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  showPageNumbers = true,
  maxVisiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  // Calculate visible page range
  const getVisiblePageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first, last, and pages around current
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );

    // Add ellipsis indicators
    if (startPage > 1) {
      pages.unshift(-1); // -1 represents "..."
      pages.unshift(1);
    }

    if (endPage < totalPages) {
      pages.push(-2); // -2 represents "..." at the end
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = showPageNumbers ? getVisiblePageNumbers() : [];

  return (
    <div className={`flex justify-center items-center mt-6 ${className}`}>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        {showPageNumbers && (
          <div className="flex items-center space-x-2 mx-2">
            {visiblePages.map((pageNum, index) => {
              if (pageNum < 0) {
                // Render ellipsis
                return (
                  <span key={`ellipsis-${index}`} className="px-2">
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "primary" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
        )}
        {!showPageNumbers && (
          <div className="px-3 py-1 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
