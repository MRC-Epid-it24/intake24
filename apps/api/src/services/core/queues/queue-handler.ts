import type { ConnectionOptions, Job, Queue, Worker } from 'bullmq';

export interface QueueHandler<T = any> {
  readonly name: string;
  queue: Queue<T>;
  workers: Worker<T>[];

  init: (connection: ConnectionOptions) => Promise<void>;
  close: () => Promise<void>;
  closeWorkers: (force?: boolean) => Promise<void>;
  processor: (job: Job<T>, token?: string) => Promise<void>;
}
