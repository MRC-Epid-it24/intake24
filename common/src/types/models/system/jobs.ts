export type Job = {
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
