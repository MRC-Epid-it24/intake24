import { SurveySubmission } from '../../models/system';
import { Pagination } from '../../models/pagination';

export type SurveySubmissionEntry = SurveySubmission;

export type SurveySubmissionsResponse = Pagination<SurveySubmissionEntry>;

export type SurveySubmissionResponse = {
  data: SurveySubmissionEntry;
};
