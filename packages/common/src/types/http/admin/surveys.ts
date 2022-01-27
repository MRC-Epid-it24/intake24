import { FeedbackSchemeEntry } from './feedback-schemes';
import { LanguageListEntry } from './languages';
import { SurveyAttributes, SurveyCreationAttributes, Pagination } from '../../models';
import { LocaleListEntry } from './locales';
import { SurveySchemeEntry } from './survey-schemes';

export interface SurveyRequest extends Omit<SurveyCreationAttributes, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

export type CreateSurveyRequest = SurveyRequest;

export type UpdateSurveyRequest = Omit<SurveyRequest, 'id'>;

export type SurveyListEntry = Pick<
  SurveyAttributes,
  'id' | 'name' | 'localeId' | 'surveySchemeId' | 'state'
>;

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
