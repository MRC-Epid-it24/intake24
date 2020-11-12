import {
  ConnectionOptions,
  Job as BullJob,
  JobsOptions,
  Queue,
  QueueEvents,
  QueueScheduler,
  Worker,
} from 'bullmq';
import config from '@/config/queue';
import { Job } from '@/db/models/system';
import jobs from '@/jobs';
import logger from '@/services/logger';
import { JobType } from '@/jobs/job';
import { QueueHandler } from './queue-handler';

export type JobData<T = any> = { job: Job; data: T };

export default class JobsQueueHandler implements QueueHandler<JobData> {
  readonly name: string;

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
  constructor(name: string) {
    this.name = name;
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

    this.queue = new Queue(this.name, { connection });

    this.queueEvents = new QueueEvents(this.name);

    this.registerQueueEvents();

    for (let i = 0; i < config.workers; i++) {
      this.workers.push(new Worker(this.name, this.processor, { connection }));
    }

    logger.info(`Queue ${this.name} has been loaded.`);
  }

  private registerQueueEvents(): void {
    this.queueEvents.on('completed', async ({ jobId }) => {
      const bullJob: BullJob | undefined = await BullJob.fromId(this.queue, jobId);
      if (!bullJob) {
        logger.warning(`Queue ${this.name}: BullJob (${jobId}) not found.`);
        return;
      }

      const { id, data } = bullJob;
      logger.info(
        `Queue ${this.name}, BullJob ${id}: Job ${data.job.id} | ${data.job.type} has completed.`
      );

      const job = await Job.findByPk(data.job.id);
      if (!job) {
        logger.error(`Queue ${this.name}, BullJob ${id}: Job entry not found (${data.job.id}).`);
        return;
      }

      await job.update({ completedAt: new Date(), progress: 1, successful: true });
    });

    this.queueEvents.on('failed', async ({ jobId }) => {
      const bullJob: BullJob | undefined = await BullJob.fromId(this.queue, jobId);

      if (!bullJob) {
        logger.warning(`Queue ${this.name}: BullJob (${jobId}) not found.`);
        return;
      }

      const { id, data, stacktrace } = bullJob;

      logger.error(
        `Queue ${this.name}, BullJob ${id}: Job ${data.job.id} | ${
          data.job.type
        } has failed.\n ${stacktrace.join('\n')}`
      );

      const job = await Job.findByPk(data.job.id);
      if (!job) {
        logger.error(`Queue ${this.name}, BullJob ${id}: Job entry not found (${data.job.id}).`);
        return;
      }

      await job.update({
        completedAt: new Date(),
        progress: 1,
        successful: false,
        stackTrace: stacktrace.join('\n'),
      });
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
    const job = await Job.findByPk(data.job.id);
    if (!job) {
      logger.error(`Queue ${this.name}, BullJob ${id}: Job entry not found (${data.job.id}).`);
      return;
    }

    await job.update({ startedAt: new Date() });

    const newJob = new jobs[job.type](data);
    await newJob.run();
  }

  /**
   * Push job into the queue
   *
   * @private
   * @param {Job} job
   * @param {*} [data={}]
   * @returns {Promise<void>}
   * @memberof JobsQueueHandler
   */
  private async queueJob(job: Job, data = {}, options: JobsOptions = {}): Promise<void> {
    const { id, type } = job;

    await this.queue.add(type, { job, data }, { delay: 500, ...options });

    logger.debug(`Queue ${this.name}: Job ${id} | ${type} queued.`);
  }

  /**
   * Add job to queue
   *
   * @param {{ type: JobType; userId: number }} input
   * @param {*} [data={}]
   * @param {JobsOptions} [options={}]
   * @returns {(Promise<Job>)}
   * @memberof JobsQueueHandler
   */
  public async addJob(
    input: { type: JobType; userId: number },
    data = {},
    options: JobsOptions = {}
  ): Promise<Job> {
    const { type, userId } = input;

    const job = await Job.create({ type, userId });
    await this.queueJob(job, data, options);

    return job;
  }
}
