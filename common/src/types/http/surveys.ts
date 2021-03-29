import { Dictionary } from '../common';
import { Scheme, SurveyState } from '../models';

export type GenerateUserResponse = {
  userName: string;
  password: string;
};
export type PublicSurveyListResponse = {
  id: string;
  // todo name: string;
  localeId: string;
};

export type PublicSurveyEntryResponse = {
  id: string;
  localeId: string;
  originatingUrl: string | null;
  supportEmail: string;
};

export type SchemeEntryResponse = Pick<Scheme, 'id' | 'type' | 'meals' | 'questions'>;

export type SurveyEntryResponse = {
  id: string;
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
