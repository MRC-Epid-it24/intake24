import { OmitAndOptional } from '../model';

export type JobAttributes = {
  id: number;
  type: string;
  userId: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
  downloadUrl: string | null;
  downloadUrlExpiresAt: Date | null;
  progress: number | null;
  successful: boolean | null;
  message: string | null;
  stackTrace: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type JobCreationAttributes = OmitAndOptional<
  JobAttributes,
  'id' | 'createdAt' | 'updatedAt',
  | 'userId'
  | 'startedAt'
  | 'completedAt'
  | 'downloadUrl'
  | 'downloadUrlExpiresAt'
  | 'progress'
  | 'successful'
  | 'message'
  | 'stackTrace'
>;
