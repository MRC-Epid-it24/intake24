import type {
  FeedbackSchemeAttributes,
  LocaleAttributes,
  SearchSortingAlgorithm,
  SurveySchemeAttributes,
  SurveyState,
  UserSurveySessionAttributes,
} from '../models';

export type GenerateUserResponse = {
  username: string;
  password: string;
};

export type CreateUserResponse = {
  userId: string;
  redirect: string;
  authToken: string;
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

export type LocaleEntryResponse = Pick<LocaleAttributes, 'id' | 'code'>;

export type SurveyEntryResponse = {
  id: string;
  slug: string;
  name: string;
  state: SurveyState;
  locale: LocaleEntryResponse;
  surveyScheme: SchemeEntryResponse;
  feedbackScheme?: FeedbackSchemeEntryResponse;
  numberOfSubmissionsForFeedback: number;
  storeUserSessionOnServer: boolean;
  suspensionReason: string | null;
  searchSortingAlgorithm: SearchSortingAlgorithm;
  searchMatchScoreWeight: number;
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

export type SurveyRequestHelpInput = {
  name: string;
  phone: string;
};
