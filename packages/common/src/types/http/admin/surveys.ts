import type {
  Pagination,
  SurveyAttributes,
  SurveyCreationAttributes,
  UserSecurableAttributes,
} from '../../models';
import type { FeedbackSchemeEntry } from './feedback-schemes';
import type { LanguageListEntry } from './languages';
import type { LocaleListEntry } from './locales';
import type { SurveySchemeEntry } from './survey-schemes';

export interface SurveyRequest extends Omit<SurveyCreationAttributes, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

export type CreateSurveyRequest = SurveyRequest;

export type UpdateSurveyRequest = SurveyRequest;

export interface SurveyListEntry
  extends Pick<SurveyAttributes, 'id' | 'slug' | 'name' | 'localeId' | 'surveySchemeId' | 'state'> {
  securables: UserSecurableAttributes[];
}

export type SurveysResponse = Pagination<SurveyListEntry>;

export interface SurveyEntry extends Omit<SurveyAttributes, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

export type SurveyRefs = {
  languages: LanguageListEntry[];
  locales: LocaleListEntry[];
  surveySchemes: SurveySchemeEntry[];
  feedbackSchemes: FeedbackSchemeEntry[];
};
