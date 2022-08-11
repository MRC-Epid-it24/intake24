import type { OmitAndOptional } from '../../common';
import type { JobType, JobTypeParams } from '../../jobs';

export type TaskAttributes = {
  id: string;
  name: string;
  job: JobType;
  cron: string;
  active: boolean;
  description: string | null;
  params: JobTypeParams;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskCreationAttributes = OmitAndOptional<
  TaskAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'active' | 'description'
>;
