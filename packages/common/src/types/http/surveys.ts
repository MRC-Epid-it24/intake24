import type {
  FeedbackSchemeAttributes,
  SurveySchemeAttributes,
  SystemLocaleAttributes,
  UserSurveySessionAttributes,
} from '@intake24/db';

import type { SearchSortingAlgorithm, SurveyRating, SurveyState } from '../../surveys';
import type { JobParams } from '../jobs';

export type GenerateUserResponse = {
  username: string;
  password: string;
};

export type CreateUserResponse = {
  userId: string;
  username: string;
  authToken: string;
  redirectUrl?: string;
};

export type PublicSurveyEntry = {
  id: string;
  slug: string;
  name: string;
  localeId: string;
  originatingUrl: string | null;
  supportEmail: string;
  openAccess: boolean;
  authCaptcha: boolean;
};

export type SchemeEntryResponse = Pick<SurveySchemeAttributes, 'id' | 'type' | 'meals' | 'prompts'>;
export type FeedbackSchemeEntryResponse = FeedbackSchemeAttributes;

export type LocaleEntryResponse = Pick<SystemLocaleAttributes, 'id' | 'code'>;

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
  followUpUrl?: string | null;
};

export type SurveySubmissionResponse = SurveyUserInfoResponse & {
  submission: {
    id: string;
    submissionTime: Date;
  };
};

export type SurveyUserSessionResponse = UserSurveySessionAttributes;

export type SurveyRequestHelpInput = Pick<
  JobParams['SurveyHelpRequestNotification'],
  'name' | 'email' | 'phone' | 'phoneCountry' | 'message'
>;

export type SurveyRatingInput = {
  type: SurveyRating;
  rating: number;
  submissionId?: string;
  comment: string | null;
};
