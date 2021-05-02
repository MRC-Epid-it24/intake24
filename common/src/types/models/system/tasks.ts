import type { OmitAndOptional } from '..';

export type TaskAttributes = {
  id: number;
  name: string;
  job: string;
  cron: string;
  active: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskCreationAttributes = OmitAndOptional<
  TaskAttributes,
  'id' | 'createdAt' | 'updatedAt',
  'active' | 'description'
>;
