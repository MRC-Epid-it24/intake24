import type { Pagination, SurveySubmissionAttributes } from '@intake24/common/types/models';

export type SurveySubmissionEntry = SurveySubmissionAttributes;

export type SurveySubmissionsResponse = Pagination<SurveySubmissionEntry>;
