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
import { Job, JobData, JobType } from '@/jobs/job';
import { QueueHandler } from './queue-handler';

export type JobInput = {
  type: JobType;
  userId?: number | null;
};

export default class JobsQueueHandler implements QueueHandler<JobData> {
  readonly name = 'it24-jobs';

  private readonly config;

  private readonly logger;

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
  constructor({ config, logger }: IoC) {
    this.config = config;
    this.logger = logger;
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

    for (let i = 0; i < this.config.queue.workers; i++) {
      this.workers.push(new Worker(this.name, this.processor, { connection }));
    }

    this.logger.info(`Queue ${this.name} has been loaded.`);
  }

  private registerQueueEvents(): void {
    this.queueEvents.on('completed', async ({ jobId }) => {
      const bullJob: BullJob<JobData> | undefined = await BullJob.fromId(this.queue, jobId);
      if (!bullJob) {
        this.logger.warn(`Queue ${this.name}: BullJob (${jobId}) not found.`);
        return;
      }

      const { id, data } = bullJob;
      this.logger.info(
        `Queue ${this.name}, BullJob ${id}: Job ${data.job.id} | ${data.job.type} has completed.`
      );

      const job = await DbJob.findByPk(data.job.id);
      if (!job) {
        this.logger.error(
          `Queue ${this.name}, BullJob ${id}: Job entry not found (${data.job.id}).`
        );
        return;
      }

      await job.update({ completedAt: new Date(), progress: 1, successful: true });
    });

    this.queueEvents.on('failed', async ({ jobId, failedReason }) => {
      const bullJob: BullJob<JobData> | undefined = await BullJob.fromId(this.queue, jobId);

      if (!bullJob) {
        this.logger.warn(`Queue ${this.name}: BullJob (${jobId}) not found.`);
        return;
      }

      const { id, data, stacktrace } = bullJob;

      this.logger.error(
        `Queue ${this.name}, BullJob ${id}: Job ${data.job.id} | ${
          data.job.type
        } has failed.\n ${stacktrace.join('\n')}`
      );

      const job = await DbJob.findByPk(data.job.id);
      if (!job) {
        this.logger.error(
          `Queue ${this.name}, BullJob ${id}: Job entry not found (${data.job.id}).`
        );
        return;
      }

      await job.update({
        completedAt: new Date(),
        progress: 1,
        successful: false,
        message: failedReason,
        stackTrace: stacktrace.join('\n'),
      });
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
   * @param {BullJob<JobData>} bullJob
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  async processor({ id, data }: BullJob<JobData>): Promise<void> {
    const job = await DbJob.findByPk(data.job.id);
    if (!job) {
      this.logger.error(`Queue ${this.name}, BullJob ${id}: Job entry not found (${data.job.id}).`);
      return;
    }

    await job.update({ startedAt: new Date() });

    const newJob = ioc.resolve<Job>(job.type);
    await newJob.run(data);
  }

  /**
   * Push job into the queue
   *
   * @private
   * @param {DbJob} job
   * @param {*} [data={}]
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  private async queueJob(job: DbJob, data = {}, options: JobsOptions = {}): Promise<void> {
    const { id, type } = job;

    await this.queue.add(type, { job, data }, options);

    this.logger.debug(`Queue ${this.name}: Job ${id} | ${type} queued.`);
  }

  /**
   * Add job to queue
   *
   * @param {JobInput} input
   * @param {*} [data={}]
   * @param {JobsOptions} [options={}]
   * @returns {Promise<DbJob>}
   * @memberof JobsQueueHandler
   */
  public async addJob(input: JobInput, data = {}, options: JobsOptions = {}): Promise<DbJob> {
    const job = await DbJob.create(input);
    await this.queueJob(job, data, options);

    return job;
  }
}
