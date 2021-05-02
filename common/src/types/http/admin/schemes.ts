import { Meal } from '../..';
import {
  ExportField,
  ExportSectionId,
  Pagination,
  SchemeAttributes,
  SchemeCreationAttributes,
} from '../../models';
import { LanguageEntry } from './languages';

export type SchemeRequest = SchemeCreationAttributes;

export type CreateSchemeRequest = SchemeRequest;

export type UpdateSchemeRequest = Omit<SchemeRequest, 'id'>;

export type SchemesResponse = Pagination<SchemeAttributes>;

export type SchemeEntry = SchemeAttributes;

export type SchemeRefs = {
  languages: LanguageEntry[];
  meals: Meal[];
};

export type SchemeResponse = {
  data: SchemeEntry;
  refs: SchemeRefs;
};

export type CreateSchemeResponse = Pick<SchemeResponse, 'refs'>;

export type StoreSchemeResponse = Pick<SchemeResponse, 'data'>;

export type SchemeExportRefsResponse = Record<ExportSectionId, ExportField[]>;
