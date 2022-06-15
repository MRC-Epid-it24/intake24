import type { PromptQuestion } from '../../../prompts';
import type { ExportField, ExportSectionId } from '../../../schemes';
import type {
  Pagination,
  SurveySchemeAttributes,
  SurveySchemeCreationAttributes,
} from '../../models';
import type { LanguageListEntry } from './languages';

export type SurveySchemeRequest = SurveySchemeCreationAttributes;

export type CreateSurveySchemeRequest = SurveySchemeRequest;

export type UpdateSurveySchemeRequest = Omit<SurveySchemeRequest, 'id'>;

export type SurveySchemesResponse = Pagination<SurveySchemeAttributes>;

export type SurveySchemeEntry = SurveySchemeAttributes;

export type SurveySchemeListEntry = Pick<SurveySchemeAttributes, 'id' | 'name'>;

export type SurveySchemeRefs = {
  languages: LanguageListEntry[];
  templates: PromptQuestion[];
};

export type SurveySchemeExportRefsResponse = Record<ExportSectionId, ExportField[]>;
