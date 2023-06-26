import type { ConnectionOptions, JobsOptions } from 'bullmq';
import { Job as BullJob, Queue, QueueEvents, Worker } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';
import type { Job } from '@intake24/api/jobs';
import type { JobData, JobParams, JobType } from '@intake24/common/types';
import ioc from '@intake24/api/ioc';
import { Job as DbJob } from '@intake24/db';

import type { PushPayload } from '..';
import type { QueueHandler } from './queue-handler';

export type JobInput<T extends JobType> = {
  type: T;
  params: JobParams[T];
  userId?: string | null;
};

export type NotificationPayload = {
  jobId: string;
  status: 'success' | 'error';
  message?: string;
};

export default class JobsQueueHandler implements QueueHandler<JobData> {
  readonly name = 'it24-jobs';

  private readonly config;

  private readonly logger;

  private readonly pusher;

  queue!: Queue<JobData>;

  queueEvents!: QueueEvents;

  workers: Worker<JobData>[] = [];

  /**
   * Creates an instance of JobsQueueHandler
   *
   * @param {string} name
   * @memberof JobsQueueHandler
   */
  constructor({ queueConfig, logger, pusher }: Pick<IoC, 'queueConfig' | 'logger' | 'pusher'>) {
    this.config = queueConfig;
    this.logger = logger.child({ service: 'JobsQueueHandler' });
    this.pusher = pusher;
  }

  private logEventError(err: Error) {
    const { message, name, stack } = err;
    this.logger.error(`${name}: ${message}`, { stack });
  }

  /**
   * Initialize JobsQueueHandler
   *
   * @param {ConnectionOptions} connection
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  public async init(connection: ConnectionOptions): Promise<void> {
    this.queue = new Queue(this.name, {
      connection,
      defaultJobOptions: {
        delay: 500,
        removeOnComplete: { age: 3600 },
        removeOnFail: { age: 24 * 3600 },
      },
    });
    this.queue.on('error', (err) => {
      this.logEventError(err);
    });

    this.queueEvents = new QueueEvents(this.name, { connection });
    this.queueEvents.on('error', (err) => {
      this.logEventError(err);
    });

    this.registerQueueEvents();

    for (let i = 0; i < this.config.workers; i++) {
      const worker = new Worker(this.name, this.processor, { connection });

      worker
        .on('completed', (job) => {
          this.logger.info(`${this.name}: ${job.name} | ${job.id} has completed.`);
        })
        .on('failed', (job, err) => {
          const { message, name, stack } = err;
          const jobInfo = job ? `${job.name} | ${job.id}` : `"Removed job"`;

          this.logger.error(`${this.name}: ${jobInfo} has failed with: ${err.message}`, {
            message,
            name,
            stack,
          });
        })
        .on('error', (err) => {
          this.logEventError(err);
        });

      this.workers.push(worker);
    }

    this.logger.info(`Queue ${this.name} has been loaded.`);
  }

  /**
   * Close queue connections
   *
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  public async close(): Promise<void> {
    for (const worker of this.workers) {
      await worker.close();
    }

    await this.queue.close();
    await this.queueEvents.close();
  }

  /**
   * Register event listeners to handle successful/failed jobs
   * - look up corresponding database record
   * - update status / messages
   * - notify users using registered channels
   *
   * @private
   * @memberof JobsQueueHandler
   */
  private registerQueueEvents(): void {
    this.queueEvents
      .on('progress', async ({ jobId, data }) => {
        const dbId = jobId.replace('db:', '');

        const job = await DbJob.findByPk(dbId);
        if (!job) {
          this.logger.error(`QueueEvent progress: Job entry not found (${dbId}).`);
          return;
        }

        if (typeof data === 'number' && data < 1) await job.update({ progress: data });
      })
      .on('completed', async ({ jobId }) => {
        const dbId = jobId.replace('db:', '');

        const job = await DbJob.findByPk(dbId);
        if (!job) {
          this.logger.error(`QueueEvent completed: Job entry not found (${dbId}).`);
          return;
        }

        await job.update({ completedAt: new Date(), progress: 1, successful: true });

        await this.notify(job.userId, { jobId: dbId, status: 'success' });
      })
      .on('failed', async ({ jobId, failedReason }) => {
        const dbId = jobId.replace('db:', '');

        const bullJob: BullJob<JobData> | undefined = await BullJob.fromId(this.queue, jobId);
        if (!bullJob) {
          this.logger.error(`QueueEvent failed: BullJob (${jobId}) not found.`);
          return;
        }

        const { name, stacktrace } = bullJob;

        this.logger.error(
          `QueueEvent failed: Job ${name} | ${jobId} has failed.\n ${stacktrace.join('\n')}`
        );

        const job = await DbJob.findByPk(dbId);
        if (!job) {
          this.logger.error(`QueueEvent failed: Job entry not found (${dbId}).`);
          return;
        }

        await job.update({
          completedAt: new Date(),
          progress: 1,
          successful: false,
          message: failedReason,
          stackTrace: stacktrace,
        });

        await this.notify(job.userId, { jobId: dbId, status: 'error', message: failedReason });
      });
  }

  /**
   * Queue job processor
   *
   * @param {BullJob<JobData>} job
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  async processor(job: BullJob<JobData>): Promise<void> {
    const { id, name } = job;

    if (!id) {
      this.logger.error(`Queue ${this.name}: Job ID missing.`);
      return;
    }

    const dbId = id.replace('db:', '');
    const dbJob = await DbJob.findByPk(dbId);
    if (!dbJob) {
      this.logger.error(`Queue ${this.name}: Job entry not found (${dbId}).`);
      return;
    }

    await dbJob.update({ startedAt: new Date() });

    const newJob = ioc.resolve<Job<typeof dbJob.type>>(name);
    await newJob.run(job);
  }

  /**
   * Push job into the queue
   *
   * @private
   * @param {DbJob} job
   * @param {JobsOptions} [options={}]
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  private async queueJob(job: DbJob, options: JobsOptions = {}): Promise<void> {
    const { id, type, params } = job;

    await this.queue.add(type, { params }, { ...options, jobId: `db:${id}` });

    this.logger.debug(`Queue ${this.name}: Job ${id} | ${type} queued.`);
  }

  /**
   * Add job to queue
   *
   * @template T
   * @param {JobInput<T>} input
   * @param {JobsOptions} [options={}]
   * @returns {Promise<DbJob>}
   * @memberof JobsQueueHandler
   */
  public async addJob<T extends JobType>(
    input: JobInput<T>,
    options: JobsOptions = {}
  ): Promise<DbJob> {
    const job = await DbJob.create(input);
    await this.queueJob(job, options);

    return job;
  }

  /**
   * Notify user about finished job
   *
   * @param {(string | null)} userId
   * @param {NotificationPayload} payload
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  public async notify(userId: string | null, payload: NotificationPayload): Promise<void> {
    if (!userId) return;

    const body = [
      'Requested action has just finished. Click on the notification to show details in application.',
    ];
    if (payload.message) body.push(`Details: ${payload.message}`);

    const pushPayload: PushPayload = {
      title: `${payload.status ? '✔️' : '❌'} ${payload.status.toUpperCase()}: Job has finished.`,
      body: body.join(' '),
      url: `jobs/${payload.jobId}`,
    };

    await this.pusher.webPush(userId, pushPayload);
  }
}
