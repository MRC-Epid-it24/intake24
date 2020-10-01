import { Meal } from '../../meals';
import { RecallQuestions } from '../../recall';
import { Language, Scheme } from '../../models/system';
import { Pagination } from '../../models/pagination';

export type SchemeRequest = {
  id: string;
  name: string;
  type: string;
  questions: RecallQuestions;
  meals: Meal[];
};

export type CreateSchemeRequest = SchemeRequest;

export type UpdateSchemeRequest = Omit<SchemeRequest, 'id'>;

export type SchemeListResponse = Pagination<Scheme>;

export type SchemeEntryRefs = {
  languages: Language[];
  meals: Meal[];
};

export type SchemeEntryResponse = {
  data: Scheme;
  refs: SchemeEntryRefs;
};

export type SchemeCreateResponse = Pick<SchemeEntryResponse, 'refs'>;

export type SchemeStoreResponse = Pick<SchemeEntryResponse, 'data'>;
