import { Meal } from '../meals';
import { RecallQuestions } from '../recall';

export type Job = {
  id: number;
  type: string;
  userId: number;
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
  prototypeLocaleId: string;
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
