import { Locale, Scheme, Survey, Pagination } from '../../models';

export type SurveyRequest = {
  id: string;
  state: number;
  startDate: string;
  endDate: string;
  schemeId: string;
  localeId: string;
  allowGenUsers: boolean;
  genUserKey?: string | null;
  supportEmail: string;
  feedbackEnabled: boolean;
  numberOfSubmissionsForFeedback: number;
  storeUserSessionOnServer: boolean;
  maximumDailySubmissions: number;
  minimumSubmissionInterval: number;
  maximumTotalSubmissions?: number | null;
  authUrlDomainOverride?: string | null;

  suspensionReason?: string | null;
  surveyMonkeyUrl?: string | null;
  originatingUrl?: string | null;
  description?: string | null;
  feedbackStyle?: string;
  submissionNotificationUrl?: string | null;
  finalPageHtml?: string | null;
};

export type CreateSurveyRequest = SurveyRequest;

export type UpdateSurveyRequest = Omit<SurveyRequest, 'id'>;

export type SurveysResponse = Pagination<Survey>;

export interface SurveyEntry extends Omit<Survey, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

export type SurveyRefs = {
  locales: Locale[];
  schemes: Scheme[];
};

export type SurveyResponse = {
  data: SurveyEntry;
  refs: SurveyRefs;
};

export type CreateSurveyResponse = Pick<SurveyResponse, 'refs'>;

export type StoreSurveyResponse = Pick<SurveyResponse, 'data'>;
