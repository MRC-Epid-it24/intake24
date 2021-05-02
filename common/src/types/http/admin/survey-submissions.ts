import { SurveySubmissionAttributes, Pagination } from '../../models';

export type SurveySubmissionEntry = SurveySubmissionAttributes;

export type SurveySubmissionsResponse = Pagination<SurveySubmissionEntry>;

export type SurveySubmissionResponse = {
  data: SurveySubmissionEntry;
};
