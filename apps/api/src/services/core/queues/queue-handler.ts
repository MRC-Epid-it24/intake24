import type { Job, Queue, QueueBaseOptions, Worker } from 'bullmq';

import type { QueueConfig } from '@intake24/api/config';
import type { Logger } from '@intake24/common-backend';

export abstract class QueueHandler<T = any> {
  abstract readonly name: string;

  protected queue!: Queue<T>;
  protected workers: Worker<T>[] = [];

  protected readonly config;
  protected readonly logger;

  abstract init(): Promise<void>;
  abstract processor(job: Job<T>, token?: string): Promise<void>;

  constructor(config: QueueConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  protected getOptions(): QueueBaseOptions {
    const { keyPrefix, ...connection } = this.config.redis;

    return { connection, prefix: keyPrefix };
  };

  protected logEventError(err: unknown) {
    if (err instanceof Error) {
      const { message, name, stack } = err;
      this.logger.error(`${name}: ${message}`, { stack });
      return;
    }

    this.logger.error(`Unknown event error: ${err}`);
  }

  public async closeWorkers(force = false) {
    await Promise.all(this.workers.map(worker => worker.close(force)));
  }

  public async close() {
    await this.closeWorkers();
    await this.queue.close();
  }
}
