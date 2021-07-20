import {
  ConnectionOptions,
  Job as BullJob,
  JobsOptions,
  Queue,
  QueueEvents,
  QueueScheduler,
  Worker,
} from 'bullmq';
import { Job as DbJob } from '@/db/models/system';
import ioc, { IoC } from '@/ioc';
import { Job } from '@/jobs';
import { JobData, JobParams, JobType } from '@common/types';
import { QueueHandler } from './queue-handler';
import { PushPayload } from '..';

export type JobInput = {
  type: JobType;
  userId?: number | null;
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

  scheduler!: QueueScheduler;

  workers: Worker<JobData>[] = [];

  /**
   * Creates an instance of JobsQueueHandler
   *
   * @param {string} name
   * @memberof JobsQueueHandler
   */
  constructor({ queueConfig, logger, pusher }: Pick<IoC, 'queueConfig' | 'logger' | 'pusher'>) {
    this.config = queueConfig;
    this.logger = logger;
    this.pusher = pusher;
  }

  /**
   * Initialize JobsQueueHandler
   *
   * @param {ConnectionOptions} connection
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  public async init(connection: ConnectionOptions): Promise<void> {
    this.scheduler = new QueueScheduler(this.name, { connection });

    this.queue = new Queue(this.name, { connection, defaultJobOptions: { delay: 500 } });

    this.queueEvents = new QueueEvents(this.name, { connection });

    this.registerQueueEvents();

    for (let i = 0; i < this.config.workers; i++) {
      this.workers.push(new Worker(this.name, this.processor, { connection }));
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
    await this.scheduler.close();
    await this.scheduler.disconnect();
    await this.queue.close();
    await this.queue.disconnect();
    await this.queueEvents.close();
    await this.queueEvents.disconnect();

    for (const worker of this.workers) {
      await worker.close();
      await worker.disconnect();
    }
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
    this.queueEvents.on('completed', async ({ jobId }) => {
      const job = await DbJob.findByPk(jobId);
      if (!job) {
        this.logger.error(`Queue ${this.name}: Job entry not found (${jobId}).`);
        return;
      }

      await job.update({ completedAt: new Date(), progress: 1, successful: true });

      await this.notify(job.userId, { jobId, status: 'success' });
    });

    this.queueEvents.on('failed', async ({ jobId, failedReason }) => {
      const bullJob: BullJob<JobData> | undefined = await BullJob.fromId(this.queue, jobId);
      if (!bullJob) {
        this.logger.warn(`Queue ${this.name}: BullJob (${jobId}) not found.`);
        return;
      }

      const { name, stacktrace } = bullJob;

      this.logger.error(
        `Queue ${this.name}: Job ${name} | ${jobId} has failed.\n ${stacktrace.join('\n')}`
      );

      const job = await DbJob.findByPk(jobId);
      if (!job) {
        this.logger.error(`Queue ${this.name}: Job entry not found (${jobId}).`);
        return;
      }

      await job.update({
        completedAt: new Date(),
        progress: 1,
        successful: false,
        message: failedReason,
        stackTrace: stacktrace.join('\n'),
      });

      await this.notify(job.userId, { jobId, status: 'error', message: failedReason });
    });

    /*
     * Clean old jobs when queue is drained
     * - do not use removeOnComplete / removeOnFail -> can't look up the job details
     *
     */
    this.queueEvents.on('drained', async () => {
      await this.queue.clean(60 * 1000, 0);
    });
  }

  /**
   * Queue job processor
   *
   * @param {BullJob<JobData>} job
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  // eslint-disable-next-line class-methods-use-this
  async processor(job: BullJob<JobData>): Promise<void> {
    const {
      id,
      data: { params },
      name,
      opts,
    } = job;

    if (!id) {
      this.logger.error(`Queue ${this.name}: Job ID missing.`);
      return;
    }

    const dbJob = await DbJob.findByPk(id);
    if (!dbJob) {
      this.logger.error(`Queue ${this.name}: Job entry not found (${id}).`);
      return;
    }

    await dbJob.update({ startedAt: new Date() });

    const newJob = ioc.resolve<Job>(name);
    await newJob.run(id, params, opts);
  }

  /**
   * Push job into the queue
   *
   * @private
   * @param {DbJob} job
   * @param {JobParams} [params]
   * @param {JobsOptions} [options={}]
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  private async queueJob(job: DbJob, params?: JobParams, options: JobsOptions = {}): Promise<void> {
    const { id, type } = job;

    await this.queue.add(type, { params }, { ...options, jobId: id.toString() });

    this.logger.debug(`Queue ${this.name}: Job ${id} | ${type} queued.`);
  }

  /**
   * Add job to queue
   *
   * @param {JobInput} input
   * @param {JobParams} [params]
   * @param {JobsOptions} [options={}]
   * @returns {Promise<DbJob>}
   * @memberof JobsQueueHandler
   */
  public async addJob(
    input: JobInput,
    params?: JobParams,
    options: JobsOptions = {}
  ): Promise<DbJob> {
    const job = await DbJob.create(input);
    await this.queueJob(job, params, options);

    return job;
  }

  /**
   * Notify user about finished job
   *
   * @param {(number | null)} userId
   * @param {NotificationPayload} payload
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  public async notify(userId: number | null, payload: NotificationPayload): Promise<void> {
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
