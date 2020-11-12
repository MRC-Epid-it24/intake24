import { ConnectionOptions, Job, Queue, QueueScheduler, Worker } from 'bullmq';

export interface QueueHandler<T = any> {
  readonly name: string;
  queue: Queue<T>;
  scheduler: QueueScheduler;

  init(connection: ConnectionOptions): Promise<void>;
  processor(job: Job<T>): Promise<void>;
}
