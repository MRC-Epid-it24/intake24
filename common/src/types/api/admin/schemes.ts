import { Meal } from '../../meals';
import { Scheme } from '../../models/system';
import { Pagination } from '../../models/pagination';

export type SchemeListResponse = Pagination<Scheme>;

export type SchemeEntryResponse = {
  data: Scheme;
  refs: {
    meals: Meal[];
  };
};

export type SchemeCreateResponse = Pick<SchemeEntryResponse, 'refs'>;

export type SchemeStoreResponse = Pick<SchemeEntryResponse, 'data'>;
