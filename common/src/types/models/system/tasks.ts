import { JobParams, JobType } from '../../jobs';
import type { OmitAndOptional } from '..';

export type TaskAttributes = {
  id: number;
  name: string;
  job: JobType;
  cron: string;
  active: boolean;
  description: string | null;
  params: JobParams;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskCreationAttributes = OmitAndOptional<
  TaskAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'active' | 'description'
>;
