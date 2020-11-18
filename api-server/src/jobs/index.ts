import { JobType, Jobs } from './job';
import PurgeRefreshTokens from './purge-refresh-tokens';
import SendPasswordReset from './send-password-reset';
import UploadSurveyRespondents from './upload-survey-respondents';

const jobs: Jobs = { PurgeRefreshTokens, SendPasswordReset, UploadSurveyRespondents };

export const validate = (job: JobType): boolean => Object.keys(jobs).includes(job);

export default jobs;
