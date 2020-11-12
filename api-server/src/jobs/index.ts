import { JobType, Jobs } from './job';
import PurgeRefreshTokens from './purge-refresh-tokens';
import SendPasswordReset from './send-password-reset';

const jobs: Jobs = { PurgeRefreshTokens, SendPasswordReset };

export const validate = (job: JobType): boolean => Object.keys(jobs).includes(job);

export default jobs;
