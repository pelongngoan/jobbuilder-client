import React, { useState, FormEvent, ReactNode } from "react";
import { Button, Input } from "../common";

interface SearchToolbarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialQuery?: string;
  isLoading?: boolean;
  additionalFilters?: ReactNode;
  className?: string;
}

/**
 * Reusable search toolbar for management pages
 * Can include additional filters alongside the search input
 */
const SearchToolbar: React.FC<SearchToolbarProps> = ({
  onSearch,
  placeholder = "Search...",
  initialQuery = "",
  isLoading = false,
  additionalFilters,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSubmit} className="flex gap-4 flex-grow">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>
        {additionalFilters && (
          <div className="flex md:items-center gap-3">{additionalFilters}</div>
        )}
      </div>
    </div>
  );
};

export default SearchToolbar;
