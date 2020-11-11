import { Job } from '../../models/system';
import { Pagination } from '../../models/pagination';

export type JobsResponse = Pagination<Job>;

export type JobEntry = Job;

export type JobResponse = {
  data: JobEntry;
};
