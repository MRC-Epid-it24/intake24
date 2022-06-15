import type { CustomField } from '../..';
import type { Pagination, UserSurveyAliasAttributes } from '../../models';

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
  name?: string;
  email?: string;
  phone?: string;
  customFields?: CustomField[];
};

export interface CreateRespondentInput extends RespondentInput {
  username: string;
  password: string;
}

export interface CreateRespondentRequest extends CreateRespondentInput {
  passwordConfirm: string;
}

export interface UpdateRespondentInput extends RespondentInput {
  password?: string;
}

export interface UpdateRespondentRequest extends UpdateRespondentInput {
  passwordConfirm?: string;
}
