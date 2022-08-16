import type { JobAttributes, Pagination, UserAttributes } from '../../models';

export type JobsResponse = Pagination<JobAttributes>;

export interface JobEntry extends JobAttributes {
  user?: UserAttributes;
}
