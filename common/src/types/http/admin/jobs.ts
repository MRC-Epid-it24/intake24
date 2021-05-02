import { JobAttributes, Pagination } from '../../models';

export type JobsResponse = Pagination<JobAttributes>;

export type JobEntry = JobAttributes;

export type JobResponse = {
  data: JobEntry;
};
