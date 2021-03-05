import { Meal } from '../..';
import {
  ExportField,
  ExportSectionId,
  Language,
  Pagination,
  Scheme,
  SchemeCreateAttributes,
} from '../../models';

export type SchemeRequest = SchemeCreateAttributes;

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

export type SchemeExportRefsResponse = Record<ExportSectionId, ExportField[]>;
