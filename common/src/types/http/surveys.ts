import type { SchemeAttributes, SurveyState, UserSessionAttributes } from '../models';

export type GenerateUserResponse = {
  userName: string;
  password: string;
};
export type PublicSurveyListResponse = {
  id: string;
  name: string;
  localeId: string;
};

export type PublicSurveyEntryResponse = {
  id: string;
  name: string;
  localeId: string;
  originatingUrl: string | null;
  supportEmail: string;
};

export type SchemeEntryResponse = Pick<SchemeAttributes, 'id' | 'type' | 'meals' | 'questions'>;

export type SurveyEntryResponse = {
  id: string;
  name: string;
  state: SurveyState;
  localeId: string;
  scheme: SchemeEntryResponse;
  numberOfSubmissionsForFeedback: number;
  storeUserSessionOnServer: boolean;
  suspensionReason: string | null;
};

export type SurveyUserInfoResponse = {
  userId: number;
  name: string | null;
  recallNumber: number;
  redirectToFeedback: boolean;
  maximumTotalSubmissionsReached: boolean;
  maximumDailySubmissionsReached: boolean;
};

export type SurveyUserSessionResponse = UserSessionAttributes;
