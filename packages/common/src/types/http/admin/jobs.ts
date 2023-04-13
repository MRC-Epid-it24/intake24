import type { JobAttributes, Pagination, UserAttributes } from '@intake24/db';

export type JobsResponse = Pagination<JobAttributes>;

export interface JobEntry extends JobAttributes {
  user?: UserAttributes;
}
