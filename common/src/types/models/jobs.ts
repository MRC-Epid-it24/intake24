export type Job = {
  id: number;
  type: string;
  userId: number | null;
  startedAt: Date;
  completedAt: Date;
  downloadUrl: string;
  downloadUrlExpiresAt: Date;
  progress: number;
  successful: boolean;
  createdAt: Date;
  updatedAt: Date;
};
