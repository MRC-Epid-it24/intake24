import type { SchemeOverrides } from '../../../schemes';
import { OmitAndOptional } from '../model';

export const surveyStates = ['notStarted', 'active', 'suspended'] as const;

export type SurveyState = typeof surveyStates[number];

export const searchSortingAlgorithms = ['paRules', 'popularity', 'globalPop', 'fixed'] as const;

export type SearchSortingAlgorithm = typeof searchSortingAlgorithms[number];

export type SurveyAttributes = {
  id: string;
  slug: string;
  name: string;
  state: SurveyState;
  startDate: Date;
  endDate: Date;
  localeId: string;
  surveySchemeId: string;
  feedbackSchemeId: string | null;
  allowGenUsers: boolean;
  genUserKey: string | null;
  supportEmail: string;
  suspensionReason: string | null;
  surveyMonkeyUrl: string | null;
  originatingUrl: string | null;
  submissionNotificationUrl: string | null;
  storeUserSessionOnServer: boolean;
  numberOfSubmissionsForFeedback: number;
  authUrlDomainOverride: string | null;
  authUrlTokenCharset: string | null;
  authUrlTokenLength: number | null;
  maximumDailySubmissions: number;
  maximumTotalSubmissions: number | null;
  minimumSubmissionInterval: number;
  searchSortingAlgorithm: SearchSortingAlgorithm;
  searchMatchScoreWeight: number;
  surveySchemeOverrides: SchemeOverrides;
  ownerId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SurveyCreationAttributes = OmitAndOptional<
  SurveyAttributes,
  'id' | 'createdAt' | 'updatedAt',
  | 'genUserKey'
  | 'authUrlDomainOverride'
  | 'authUrlTokenCharset'
  | 'authUrlTokenLength'
  | 'suspensionReason'
  | 'surveyMonkeyUrl'
  | 'originatingUrl'
  | 'feedbackSchemeId'
  | 'submissionNotificationUrl'
  | 'numberOfSubmissionsForFeedback'
  | 'maximumDailySubmissions'
  | 'maximumTotalSubmissions'
  | 'minimumSubmissionInterval'
  | 'searchSortingAlgorithm'
  | 'searchMatchScoreWeight'
  | 'ownerId'
>;

// TODO: to review
export type Deprecated = 'surveyMonkeyUrl' | 'originatingUrl';

export type SurveyAttributesKeys = keyof Omit<SurveyAttributes, Deprecated>;

export const updateSurveyFields = [
  'name',
  'state',
  'startDate',
  'endDate',
  'localeId',
  'surveySchemeId',
  'feedbackSchemeId',
  'allowGenUsers',
  'genUserKey',
  'suspensionReason',
  'supportEmail',
  'submissionNotificationUrl',
  'storeUserSessionOnServer',
  'numberOfSubmissionsForFeedback',
  'authUrlDomainOverride',
  'authUrlTokenCharset',
  'authUrlTokenLength',
  'maximumDailySubmissions',
  'maximumTotalSubmissions',
  'minimumSubmissionInterval',
  'searchSortingAlgorithm',
  'searchMatchScoreWeight',
  'surveySchemeOverrides',
] as const;

export type UpdateSurveyFields = typeof updateSurveyFields[number];

export const createSurveyFields = ['slug', ...updateSurveyFields] as const;

export type CreateSurveyFields = typeof updateSurveyFields[number];

export const staffUpdateSurveyFields = [
  'name',
  'state',
  'startDate',
  'endDate',
  'localeId',
  'surveySchemeId',
  'feedbackSchemeId',
  'supportEmail',
  'suspensionReason',
] as const;

export type StaffUpdateSurveyFields = typeof staffUpdateSurveyFields[number];

export const overridesFields = ['surveySchemeOverrides'] as const;

export type OverridesFields = typeof overridesFields[number];
