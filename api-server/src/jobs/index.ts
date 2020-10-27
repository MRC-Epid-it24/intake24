import { JobType, Jobs } from './job';
import PurgeRefreshTokens from './purge-refresh-tokens';

const jobs: Jobs = { PurgeRefreshTokens };

export const validate = (job: JobType): boolean => Object.keys(jobs).includes(job);

export default jobs;
