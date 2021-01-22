import { Dictionary } from '../common';
import { Scheme } from '../models';

export type GenerateUserResponse = {
  userName: string;
  password: string;
};

export interface SurveyParametersResponse {
  description: string | null;
  finalPageHtml: string | null;
  id: string;
  localeId: string;
  numberOfSurveysForFeedback: number;
  schemeId: string;
  scheme: Scheme;
  state: string;
  storeUserSessionOnServer: boolean;
  suspensionReason: string | null;
  uxEventsSettings: Dictionary;
}

export interface SurveyPublicParametersResponse {
  localeId: string;
  originatingURL: string | null;
  respondentLanguageId: string;
  supportEmail: string;
}

export interface SurveyUserInfoResponse {
  id: number;
  name: string | null;
  recallNumber: number;
  redirectToFeedback: boolean;
}

export type UserInfoResponse = {
  userId: number;
  name: string | null;
  recallNumber: number;
  redirectToFeedback: boolean;
  maximumTotalSubmissionsReached: boolean;
  maximumDailySubmissionsReached: boolean;
};
