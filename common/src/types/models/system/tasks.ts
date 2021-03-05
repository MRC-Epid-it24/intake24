export type Task = {
  id: number;
  name: string;
  job: string;
  cron: string;
  active: boolean;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskCreateAttributes = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
