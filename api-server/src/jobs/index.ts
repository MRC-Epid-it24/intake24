import { JobType, Jobs } from './job';
import PurgeRefreshTokens from './purge-refresh-tokens';
import SendPasswordReset from './send-password-reset';
import SurveyDataExport from './survey-data-export';
import SurveyExportRespondentAuthUrls from './survey-export-respondent-auth-urls';
import SurveyImportRespondents from './survey-import-respondents';

const jobs: Jobs = {
  PurgeRefreshTokens,
  SendPasswordReset,
  SurveyDataExport,
  SurveyExportRespondentAuthUrls,
  SurveyImportRespondents,
};

export const validate = (job: JobType): boolean => Object.keys(jobs).includes(job);

export default jobs;
