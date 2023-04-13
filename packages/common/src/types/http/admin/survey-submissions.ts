import type { Pagination, SurveySubmissionAttributes } from '@intake24/db';

export type SurveySubmissionEntry = SurveySubmissionAttributes;

export type SurveySubmissionsResponse = Pagination<SurveySubmissionEntry>;
