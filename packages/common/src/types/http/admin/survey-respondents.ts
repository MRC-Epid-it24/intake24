import { CustomField } from '../..';
import type { Pagination } from '../../models';

export type RespondentEntry = {
  userId: string;
  userName: string;
  surveyId: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  customFields: CustomField[];
};

export type SurveyRespondentListEntry = RespondentEntry[];

export type SurveyRespondentsResponse = Pagination<SurveyRespondentListEntry>;

export type SurveyRespondentResponse = {
  data: RespondentEntry;
};

export type RespondentInput = {
  name?: string;
  email?: string;
  phone?: string;
  customFields?: CustomField[];
};

export interface CreateRespondentInput extends RespondentInput {
  userName: string;
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
