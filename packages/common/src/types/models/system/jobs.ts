import type { OmitAndOptional } from '../../common';
import type { JobType } from '../../jobs';

export type JobAttributes = {
  id: string;
  type: JobType;
  userId: string | null;
  downloadUrl: string | null;
  downloadUrlExpiresAt: Date | null;
  progress: number | null;
  successful: boolean | null;
  message: string | null;
  stackTrace: string[] | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type JobCreationAttributes = OmitAndOptional<
  JobAttributes,
  'id' | 'createdAt' | 'updatedAt',
  | 'userId'
  | 'downloadUrl'
  | 'downloadUrlExpiresAt'
  | 'progress'
  | 'successful'
  | 'message'
  | 'stackTrace'
  | 'startedAt'
  | 'completedAt'
>;
