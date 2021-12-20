import { LanguageListEntry } from './languages';
import { SurveyAttributes, SurveyCreationAttributes, Pagination } from '../../models';
import { LocaleListEntry } from './locales';
import { SchemeEntry } from './schemes';

export interface SurveyRequest extends Omit<SurveyCreationAttributes, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

export type CreateSurveyRequest = SurveyRequest;

export type UpdateSurveyRequest = Omit<SurveyRequest, 'id'>;

export type SurveyListEntry = Pick<
  SurveyAttributes,
  'id' | 'name' | 'localeId' | 'schemeId' | 'state'
>;

export type SurveysResponse = Pagination<SurveyListEntry>;

export interface SurveyEntry extends Omit<SurveyAttributes, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

export type SurveyRefs = {
  languages: LanguageListEntry[];
  locales: LocaleListEntry[];
  schemes: SchemeEntry[];
};
