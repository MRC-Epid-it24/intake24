import { LanguageEntry } from './languages';
import { SurveyAttributes, SurveyCreationAttributes, Pagination } from '../../models';
import { LocaleEntry } from './locales';
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
  languages: LanguageEntry[];
  locales: LocaleEntry[];
  schemes: SchemeEntry[];
};

export type SurveyResponse = {
  data: SurveyEntry;
  refs: SurveyRefs;
};

export type CreateSurveyResponse = Pick<SurveyResponse, 'refs'>;

export type StoreSurveyResponse = Pick<SurveyResponse, 'data'>;
