import PurgeRefreshTokens from './purge-refresh-tokens';
import SendPasswordReset from './send-password-reset';
import SurveyDataExport from './survey-data-export';
import SurveyExportRespondentAuthUrls from './survey-export-respondent-auth-urls';
import SurveyImportRespondents from './survey-import-respondents';

export * from './job';

const jobs = {
  PurgeRefreshTokens,
  SendPasswordReset,
  SurveyDataExport,
  SurveyExportRespondentAuthUrls,
  SurveyImportRespondents,
};

export type JobType = keyof typeof jobs;

export type Jobs = {
  [P in JobType]: new (...args: any[]) => typeof jobs[P];
};

export const validate = (job: JobType): boolean => Object.keys(jobs).includes(job);

export default jobs;
