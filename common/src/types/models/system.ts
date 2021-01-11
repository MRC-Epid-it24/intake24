import { AnyDictionary } from '../common';
import { Meal } from '../meals';
import { RecallQuestions } from '../recall';

export type ClientErrorReport = {
  id: number;
  userId: number | null;
  surveyId: string | null;
  reportedAt: Date;
  stackTrace: string;
  surveyStateJson: AnyDictionary;
  new: boolean;
};

export type LocalField = {
  id: number;
  localeId: string;
  fieldName: string;
  description: string;
};

export type LocalNutrientType = {
  id: number;
  localeId: string;
  nutrientTypeId: number;
};

export type NutrientType = {
  id: number;
  description: string;
  unitId: number;
};

export type NutrientUnit = {
  id: number;
  description: string;
  symbol: string;
};

export type Job = {
  id: number;
  type: string;
  userId: number | null;
  startedAt: Date;
  completedAt: Date;
  downloadUrl: string;
  downloadUrlExpiresAt: Date;
  progress: number;
  successful: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Language = {
  id: string;
  englishName: string;
  localName: string;
  countryFlagCode: string;
  textDirection: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Locale = {
  id: string;
  englishName: string;
  localName: string;
  respondentLanguageId: string;
  adminLanguageId: string;
  countryFlagCode: string;
  prototypeLocaleId: string | null;
  textDirection: string;
};

export enum SchemeTypes {
  DATA_DRIVEN = 'data-driven',
}

export type SchemeType = SchemeTypes;

export type Scheme = {
  id: string;
  name: string;
  type: SchemeType;
  questions: RecallQuestions;
  meals: Meal[];
  createdAt: Date;
  updatedAt: Date;
};

export enum SurveyState {
  NOT_STARTED = 0,
  ACTIVE = 1,
  SUSPENDED = 2,
}

export type Survey = {
  id: string;
  state: SurveyState;
  startDate: Date;
  endDate: Date;
  schemeId: string;
  localeId: string;
  allowGenUsers: boolean;
  genUserKey: string | null;
  authUrlDomainOverride: string | null;
  suspensionReason: string | null;
  surveyMonkeyUrl: string | null;
  supportEmail: string;
  originatingUrl: string | null;
  description: string | null;
  feedbackEnabled: boolean;
  feedbackStyle: string;
  submissionNotificationUrl: string | null;
  storeUserSessionOnServer: boolean;
  numberOfSubmissionsForFeedback: number;
  finalPageHtml: string | null;
  maximumDailySubmissions: number;
  maximumTotalSubmissions: number | null;
  minimumSubmissionInterval: number;
};

export type Task = {
  id: number;
  name: string;
  job: string;
  cron: string;
  active: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Permission = {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Role = {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  simpleName: string | null;
  emailNotifications: boolean;
  smsNotifications: boolean;
  multiFactorAuthentication: boolean;
  createdAt: Date;
  updatedAt: Date;
};
