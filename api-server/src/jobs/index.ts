import { JobType } from '@common/types';
import CleanStorageFiles from './clean-storage-files';
import PurgeRefreshTokens from './purge-refresh-tokens';
import SendPasswordReset from './send-password-reset';
import SurveyDataExport from './survey-data-export';
import SurveyExportRespondentAuthUrls from './survey-export-respondent-auth-urls';
import SurveyImportRespondents from './survey-import-respondents';
import SurveySubmissionNotification from './survey-submission-notification';

export * from './job';
export { default as Job } from './job';

const jobs = {
  CleanStorageFiles,
  PurgeRefreshTokens,
  SendPasswordReset,
  SurveyDataExport,
  SurveyExportRespondentAuthUrls,
  SurveyImportRespondents,
  SurveySubmissionNotification,
};

export type Jobs = {
  [P in JobType]: new (...args: any[]) => typeof jobs[P];
};

export default jobs;
