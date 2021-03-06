export interface PaginationMeta {
  from: number;
  lastPage: number;
  page: number;
  path: string;
  limit: number;
  to: number;
  total: number;
}

export interface Pagination<R> {
  data: R[];
  meta: PaginationMeta;
}
