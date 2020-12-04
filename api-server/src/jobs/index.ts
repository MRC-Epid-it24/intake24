import { JobType, Jobs } from './job';
import PurgeRefreshTokens from './purge-refresh-tokens';
import SendPasswordReset from './send-password-reset';
import ExportSurveyRespondentAuthUrls from './export-survey-respondent-auth-urls';
import ImportSurveyRespondents from './import-survey-respondents';

const jobs: Jobs = {
  PurgeRefreshTokens,
  SendPasswordReset,
  ExportSurveyRespondentAuthUrls,
  ImportSurveyRespondents,
};

export const validate = (job: JobType): boolean => Object.keys(jobs).includes(job);

export default jobs;
