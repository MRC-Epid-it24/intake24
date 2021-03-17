import CleanStorageFiles from './clean-storage-files';
import PurgeRefreshTokens from './purge-refresh-tokens';
import SendPasswordReset, { SendPasswordResetData } from './send-password-reset';
import SurveyDataExport, { SurveyDataExportData } from './survey-data-export';
import SurveyExportRespondentAuthUrls, {
  SurveyExportRespondentAuthUrlsData,
} from './survey-export-respondent-auth-urls';
import SurveyImportRespondents, { SurveyImportRespondentsData } from './survey-import-respondents';

export * from './job';

const jobs = {
  CleanStorageFiles,
  PurgeRefreshTokens,
  SendPasswordReset,
  SurveyDataExport,
  SurveyExportRespondentAuthUrls,
  SurveyImportRespondents,
};

export type JobInputData =
  | SendPasswordResetData
  | SurveyDataExportData
  | SurveyExportRespondentAuthUrlsData
  | SurveyImportRespondentsData;

export type JobType = keyof typeof jobs;

export type Jobs = {
  [P in JobType]: new (...args: any[]) => typeof jobs[P];
};

export const validate = (job: JobType): boolean => Object.keys(jobs).includes(job);

export default jobs;
