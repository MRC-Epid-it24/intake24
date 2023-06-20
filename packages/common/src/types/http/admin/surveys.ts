import type {
  FeedbackSchemeAttributes,
  Pagination,
  SurveyAttributes,
  SurveyCreationAttributes,
  SurveySchemeAttributes,
  SystemLocaleAttributes,
  UserSecurableAttributes,
} from '@intake24/db';

import type { FeedbackSchemeRefEntry } from './feedback-schemes';
import type { LanguageListEntry } from './languages';
import type { LocaleListEntry } from './locales';
import type { SurveySchemeRefEntry } from './survey-schemes';
import type { Owner } from './users';

export interface SurveyRequest extends Omit<SurveyCreationAttributes, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

export type CreateSurveyRequest = SurveyRequest;

export type UpdateSurveyRequest = SurveyRequest;

export interface SurveyListEntry
  extends Pick<SurveyAttributes, 'id' | 'slug' | 'name' | 'localeId' | 'surveySchemeId' | 'state'> {
  locale: Pick<SystemLocaleAttributes, 'code'>;
  surveyScheme: Pick<SurveySchemeAttributes, 'name'>;
  securables: UserSecurableAttributes[];
}

export type SurveysResponse = Pagination<SurveyListEntry>;

export interface SurveyEntry extends Omit<SurveyAttributes, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
  locale: SystemLocaleAttributes;
  feedbackScheme?: FeedbackSchemeAttributes;
  surveyScheme: SurveySchemeAttributes;
  owner?: Owner;
  securables?: UserSecurableAttributes[];
}

export type SurveyRefs = {
  languages: LanguageListEntry[];
  locales: LocaleListEntry[];
  surveySchemes: SurveySchemeRefEntry[];
  feedbackSchemes: FeedbackSchemeRefEntry[];
};
