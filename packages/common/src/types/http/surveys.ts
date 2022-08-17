import type {
  FeedbackSchemeAttributes,
  SurveySchemeAttributes,
  SurveyState,
  UserSurveySessionAttributes,
} from '../models';

export type GenerateUserResponse = {
  username: string;
  password: string;
};

export type PublicSurveyEntry = {
  id: string;
  slug: string;
  name: string;
  localeId: string;
  originatingUrl: string | null;
  supportEmail: string;
  openAccess: boolean;
};

export type SchemeEntryResponse = Pick<
  SurveySchemeAttributes,
  'id' | 'type' | 'meals' | 'questions'
>;
export type FeedbackSchemeEntryResponse = FeedbackSchemeAttributes;

export type SurveyEntryResponse = {
  id: string;
  slug: string;
  name: string;
  state: SurveyState;
  localeId: string;
  surveyScheme: SchemeEntryResponse;
  feedbackScheme?: FeedbackSchemeEntryResponse;
  numberOfSubmissionsForFeedback: number;
  storeUserSessionOnServer: boolean;
  suspensionReason: string | null;
};

export type SurveyUserInfoResponse = {
  userId: string;
  name: string | null;
  submissions: number;
  showFeedback: boolean;
  maximumTotalSubmissionsReached: boolean;
  maximumDailySubmissionsReached: boolean;
};

export type SurveyUserSessionResponse = UserSurveySessionAttributes;

export interface SurveyFollowUpResponse extends SurveyUserInfoResponse {
  followUpUrl: string | null;
}
