// Re-export all types
export * from './pnode';
export * from './network';
export * from './alert';

/**
 * Common utility types
 */

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: number;
}

/**
 * Pagination
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

/**
 * Time range
 */
export type TimeRange = '1h' | '24h' | '7d' | '30d' | 'all';

export interface TimeRangeOption {
  value: TimeRange;
  label: string;
  milliseconds: number;
}

/**
 * Status indicator
 */
export type Status = 'online' | 'offline' | 'degraded' | 'unknown';

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

/**
 * Error state
 */
export interface ErrorState {
  hasError: boolean;
  error?: Error;
  message?: string;
}

/**
 * Async data state
 */
export type AsyncDataState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: Error };

/**
 * Form field
 */
export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

/**
 * Selectable item
 */
export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: string;
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  id: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

/**
 * Filter option
 */
export interface FilterOption {
  id: string;
  label: string;
  type: 'select' | 'range' | 'checkbox' | 'search';
  options?: SelectOption[];
  min?: number;
  max?: number;
}