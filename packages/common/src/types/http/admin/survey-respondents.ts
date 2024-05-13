import type { Pagination, UserSurveyAliasAttributes } from '@intake24/db';

import type { CustomField } from '../..';

export interface SurveyRespondentEntry
  extends Omit<UserSurveyAliasAttributes, 'createdAt' | 'updatedAt'> {
  name: string | null;
  email: string | null;
  phone: string | null;
  customFields: CustomField[];
  surveyAuthUrl: string;
  feedbackAuthUrl: string;
}

export interface SurveyRespondentListEntry
  extends Omit<UserSurveyAliasAttributes, 'createdAt' | 'updatedAt'> {
  surveyAuthUrl: string;
  feedbackAuthUrl: string;
}

export type SurveyRespondentsResponse = Pagination<SurveyRespondentListEntry>;

export type RespondentInput = {
  password?: string | null;
  passwordConfirm?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  customFields?: CustomField[];
};

export interface CreateRespondentInput extends RespondentInput {
  username: string;
}
