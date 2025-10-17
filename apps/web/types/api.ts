export interface Response<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
}
