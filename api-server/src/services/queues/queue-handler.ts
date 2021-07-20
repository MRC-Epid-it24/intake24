import { ConnectionOptions, Job, Queue, QueueScheduler, Worker } from 'bullmq';

export interface QueueHandler<T = any> {
  readonly name: string;
  queue: Queue<T>;
  scheduler: QueueScheduler;
  workers: Worker<T>[];

  init(connection: ConnectionOptions): Promise<void>;
  processor(job: Job<T>, token?: string): Promise<void>;
}
