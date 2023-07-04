import type {
  Pagination,
  SurveySchemePromptAttributes,
  SurveySchemePromptCreationAttributes,
} from '@intake24/db';

import type { SurveySchemeRefEntry } from './survey-schemes';

export type SurveySchemePromptRequest = SurveySchemePromptCreationAttributes;

export type CreateSurveySchemePromptRequest = SurveySchemePromptRequest;

export type UpdateSurveySchemePromptRequest = Omit<SurveySchemePromptRequest, 'id'>;

export type SurveySchemePromptsResponse = Pagination<SurveySchemePromptAttributes>;

export type SurveySchemePromptEntry = SurveySchemePromptAttributes;

export type SurveySchemePromptRefs = {
  schemes: SurveySchemeRefEntry[];
  promptIds: string[];
};
