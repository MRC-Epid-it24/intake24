import { PartialRecord, Meal, RecallQuestions } from '../..';
import { Language, Scheme, Pagination, ExportField, ExportSection } from '../../models';

export type SchemeRequest = {
  id: string;
  name: string;
  type: string;
  questions: RecallQuestions;
  meals: Meal[];
};

export type CreateSchemeRequest = SchemeRequest;

export type UpdateSchemeRequest = Omit<SchemeRequest, 'id'>;

export type SchemesResponse = Pagination<Scheme>;

export type SchemeEntry = Scheme;

export type SchemeRefs = {
  languages: Language[];
  meals: Meal[];
};

export type SchemeResponse = {
  data: SchemeEntry;
  refs: SchemeRefs;
};

export type CreateSchemeResponse = Pick<SchemeResponse, 'refs'>;

export type StoreSchemeResponse = Pick<SchemeResponse, 'data'>;

export type SchemeExportRefsResponse = PartialRecord<ExportSection, ExportField[]>;
