// Common types shared across different modules

// MongoDB ObjectId type
export type ObjectId = string;

// Response format for API calls
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// Common date range filter
export interface DateRangeFilter {
  startDate?: Date | string;
  endDate?: Date | string;
}

// Sort direction options
export type SortDirection = "asc" | "desc";

// Sort options
export interface SortOptions {
  field: string;
  direction: SortDirection;
}
