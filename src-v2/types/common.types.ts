// MongoDB ObjectId type
export type ObjectId = string;

// Response format for API calls
export interface ApiResponse<T = any> {
  pagination: {
    pages: number;
    total: number;
    limit: number;
  };
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination response
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
//New types
export interface CUDResponse {
  success: boolean;
  message: string;
}

export interface GetResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
