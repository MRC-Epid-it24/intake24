import { PromptQuestion } from '../../../prompts';
import {
  ExportField,
  ExportSectionId,
  Pagination,
  SchemeAttributes,
  SchemeCreationAttributes,
} from '../../models';
import { LanguageListEntry } from './languages';

export type SchemeRequest = SchemeCreationAttributes;

export type CreateSchemeRequest = SchemeRequest;

export type UpdateSchemeRequest = Omit<SchemeRequest, 'id'>;

export type SchemesResponse = Pagination<SchemeAttributes>;

export type SchemeEntry = SchemeAttributes;

export type SchemeListEntry = Pick<SchemeAttributes, 'id' | 'name'>;

export type SchemeRefs = {
  languages: LanguageListEntry[];
  templates: PromptQuestion[];
};

export type SchemeExportRefsResponse = Record<ExportSectionId, ExportField[]>;
