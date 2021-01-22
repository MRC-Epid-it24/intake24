import { Job, Pagination } from '../../models';

export type JobsResponse = Pagination<Job>;

export type JobEntry = Job;

export type JobResponse = {
  data: JobEntry;
};
