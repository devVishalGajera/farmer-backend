/**
 * Standard API Response Structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    details?: any;
  };
  timestamp?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

/**
 * Success response helper
 */
export class SuccessResponse<T> implements ApiResponse<T> {
  success: boolean = true;
  message: string;
  data?: T;
  timestamp: string;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error response helper
 */
export class ErrorResponse implements ApiResponse {
  success: boolean = false;
  message: string;
  error?: {
    code?: string;
    details?: any;
  };
  timestamp: string;

  constructor(message: string, code?: string, details?: any) {
    this.message = message;
    this.error = { code, details };
    this.timestamp = new Date().toISOString();
  }
}

