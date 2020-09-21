import { Locale, Scheme, Survey } from '../../models/system';
import { Pagination } from '../../models/pagination';

export type SurveyListResponse = Pagination<Survey>;

export interface SurveyResponse extends Omit<Survey, 'startDate' | 'endDate'> {
  startDate: string;
  endDate: string;
}

export type SurveyEntryRefs = {
  locales: Locale[];
  schemes: Scheme[];
};

export type SurveyEntryResponse = {
  data: SurveyResponse;
  refs: SurveyEntryRefs;
};

export type SurveyCreateResponse = Pick<SurveyEntryResponse, 'refs'>;

export type SurveyStoreResponse = Pick<SurveyEntryResponse, 'data'>;
