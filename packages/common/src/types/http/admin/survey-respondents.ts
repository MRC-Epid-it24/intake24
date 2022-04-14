import { CustomField } from '../..';
import type { Pagination, UserSurveyAliasAttributes } from '../../models';

export interface SurveyRespondentEntry
  extends Omit<UserSurveyAliasAttributes, 'createdAt' | 'updatedAt'> {
  name: string | null;
  email: string | null;
  phone: string | null;
  customFields: CustomField[];
}

export type SurveyRespondentListEntry = Omit<UserSurveyAliasAttributes, 'createdAt' | 'updatedAt'>;

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
