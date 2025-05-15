import React from "react";
import { Button } from "../common";

export type ViewMode = "table" | "grid";

interface ViewToggleProps {
  currentView: ViewMode;
  onToggle: (view: ViewMode) => void;
  className?: string;
}

/**
 * Component for toggling between table and grid views in management pages
 */
const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onToggle,
  className = "",
}) => {
  return (
    <Button
      variant="outline"
      onClick={() => onToggle(currentView === "table" ? "grid" : "table")}
      className={`flex items-center gap-2 ${className}`}
    >
      {currentView === "table" ? (
        <>
          <GridIcon />
          Grid View
        </>
      ) : (
        <>
          <TableIcon />
          Table View
        </>
      )}
    </Button>
  );
};

// Grid view icon
const GridIcon: React.FC = () => (
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
);

// Table view icon
const TableIcon: React.FC = () => (
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
);

export default ViewToggle;
