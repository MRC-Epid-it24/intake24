import { SurveySubmission, Pagination } from '../../models';

export type SurveySubmissionEntry = SurveySubmission;

export type SurveySubmissionsResponse = Pagination<SurveySubmissionEntry>;

export type SurveySubmissionResponse = {
  data: SurveySubmissionEntry;
};
