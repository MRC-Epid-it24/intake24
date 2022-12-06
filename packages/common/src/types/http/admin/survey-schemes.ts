import type { Prompt } from '../../../prompts';
import type { ExportField, ExportSectionId } from '../../../schemes';
import type {
  Pagination,
  SurveySchemeAttributes,
  SurveySchemeCreationAttributes,
} from '../../models';
import type { LanguageListEntry } from './languages';
import type { Owner } from './users';

export type SurveySchemeRequest = SurveySchemeCreationAttributes;

export type CreateSurveySchemeRequest = SurveySchemeRequest;

export type UpdateSurveySchemeRequest = Omit<SurveySchemeRequest, 'id'>;

export type SurveySchemesResponse = Pagination<SurveySchemeAttributes>;

export interface SurveySchemeEntry extends SurveySchemeAttributes {
  owner?: Owner;
}

export type SurveySchemeRefEntry = SurveySchemeAttributes;

export type SurveySchemeListEntry = Pick<SurveySchemeAttributes, 'id' | 'name'>;

export type SurveySchemeRefs = {
  languages: LanguageListEntry[];
  templates: Prompt[];
};

export type SurveySchemeExportRefsResponse = Record<ExportSectionId, ExportField[]>;
