import type {
  Pagination,
  SurveySchemeAttributes,
  SurveySchemeCreationAttributes,
  UserSecurableAttributes,
} from '@intake24/db';

import type { Prompt } from '../../../prompts';
import type { ExportField, ExportSectionId } from '../../../surveys';
import type { Owner } from './users';

export type SurveySchemeRequest = SurveySchemeCreationAttributes;

export type CreateSurveySchemeRequest = SurveySchemeRequest;

export type UpdateSurveySchemeRequest = Omit<SurveySchemeRequest, 'id'>;

export type SurveySchemesResponse = Pagination<SurveySchemeAttributes>;

export interface SurveySchemeEntry extends SurveySchemeAttributes {
  owner?: Owner;
  securables?: UserSecurableAttributes[];
}

export type SurveySchemeRefEntry = SurveySchemeAttributes;

export type SurveySchemeListEntry = Pick<SurveySchemeAttributes, 'id' | 'name'>;

export type SurveySchemeRefs = {
  templates: Prompt[];
};

export type SurveySchemeTemplates = Pagination<Prompt>;

export type SurveySchemeExportRefsResponse = Record<ExportSectionId, ExportField[]>;
