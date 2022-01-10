import { JobType } from '@intake24/common/types';
import CleanRedisStore from './clean-redis-store';
import CleanStorageFiles from './clean-storage-files';
import PurgeRefreshTokens from './purge-refresh-tokens';
import SendPasswordReset from './send-password-reset';
import NutrientTableImportData from './nutrient-table-import-data';
import NutrientTableImportMapping from './nutrient-table-import-mapping';
import SurveyDataExport from './survey-data-export';
import SurveyExportRespondentAuthUrls from './survey-export-respondent-auth-urls';
import SurveyImportRespondents from './survey-import-respondents';
import SurveySubmissionNotification from './survey-submission-notification';

export * from './job';
export { default as Job } from './job';
export { default as StreamLockJob } from './stream-lock-job';

const jobs = {
  // System
  CleanRedisStore,
  CleanStorageFiles,
  PurgeRefreshTokens,
  SendPasswordReset,
  // Nutrient tables
  NutrientTableImportData,
  NutrientTableImportMapping,
  // Surveys
  SurveyDataExport,
  SurveyExportRespondentAuthUrls,
  SurveyImportRespondents,
  SurveySubmissionNotification,
};

export type Jobs = {
  [P in JobType]: new (...args: any[]) => typeof jobs[P];
};

export default jobs;
