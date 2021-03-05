import { ConnectionOptions, Job as BullJob, Queue, QueueScheduler, Worker } from 'bullmq';
import { Task } from '@/db/models/system';
import ioc, { IoC } from '@/ioc';
import { validate, Job, JobType } from '@/jobs';
import { QueueHandler } from './queue-handler';

export type TaskData = { jobType: JobType };

export default class TasksQueueHandler implements QueueHandler<TaskData> {
  readonly name = 'it24-tasks';

  private readonly logger;

  queue!: Queue<TaskData>;

  scheduler!: QueueScheduler;

  workers: Worker<TaskData>[] = [];

  /**
   * Creates an instance of TasksQueueHandler.
   * @param {IoC} { logger }
   * @memberof TasksQueueHandler
   */
  constructor({ logger }: Pick<IoC, 'logger'>) {
    this.logger = logger;
  }

  /**
   * Initialize TasksQueueHandler
   *
   * @param {ConnectionOptions} connection
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async init(connection: ConnectionOptions): Promise<void> {
    this.scheduler = new QueueScheduler(this.name, { connection });

    this.queue = new Queue(this.name, {
      connection,
      defaultJobOptions: { removeOnComplete: true, removeOnFail: true },
    });

    const worker = new Worker(this.name, this.processor, { connection });

    worker.on('completed', (job) => {
      this.logger.info(`${this.name}: ${job.id} has completed.`);
    });

    worker.on('failed', (job, err) => {
      this.logger.error(`${this.name}: ${job.id} has failed with ${err.message}`);
    });

    this.workers.push(worker);

    await this.clearRepeatableJobs();
    await this.loadRepeatableJobs();

    this.logger.info(`${this.constructor.name} has been loaded.`);
  }

  /**
   * Close queue connections
   *
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async close(): Promise<void> {
    await this.scheduler.close();
    await this.scheduler.disconnect();
    await this.queue.close();
    await this.queue.disconnect();

    for (const worker of this.workers) {
      await worker.close();
      await worker.disconnect();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async processor(job: BullJob<TaskData>): Promise<void> {
    const task = ioc.resolve<Job>(job.data.jobType);
    await task.run();
  }

  /**
   * Remove repeatable job(s) from queue
   *
   * @private
   * @param {string} [name]
   * @memberof Scheduler
   */
  private async clearRepeatableJobs(name?: string) {
    const repeatableJobs = await this.queue.getRepeatableJobs();

    for (const job of repeatableJobs) {
      if (name && job.name !== name) continue;

      await this.queue.removeRepeatableByKey(job.key);
    }
  }

  /**
   * Load repeatable jobs from DB to the queue
   *
   * @private
   * @memberof TasksQueueHandler
   */
  private async loadRepeatableJobs() {
    const tasks = await Task.findAll({ where: { active: true } });

    for (const task of tasks) {
      await this.addJob(task);
    }
  }

  /**
   * Push job into the queue
   *
   * @private
   * @param {Task} task
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  private async queueJob(task: Task): Promise<void> {
    const { name, job: jobType, cron } = task;

    await this.queue.add(name, { jobType }, { repeat: { cron } });
  }

  /**
   * Remove job from queue
   *
   * @private
   * @param {Task} task
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  private async dequeueJob(task: Task): Promise<void> {
    this.clearRepeatableJobs(task.name);
  }

  /**
   * Add task's job to queue
   *
   * @param {Task} task
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async addJob(task: Task): Promise<void> {
    const { id, name, job, active } = task;

    if (!validate(job)) {
      this.logger.warn(`${this.constructor.name}: Job "${job}" not found in job definitions.`);
      return;
    }

    if (!active) {
      this.logger.warn(
        `${this.constructor.name}: Task (ID: ${id}, Name: ${name}) not set as active.`
      );
      return;
    }

    await this.queueJob(task);

    this.logger.debug(`${this.constructor.name}: Task (ID: ${id}, Name: ${name}) added.`);
  }

  /**
   * Update task's job to queue
   *
   * @param {Task} task
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async updateJob(task: Task): Promise<void> {
    const { id, name, job } = task;

    if (!validate(job)) {
      this.logger.warn(`${this.constructor.name}: Job "${job}" not found in job definitions.`);
      return;
    }

    await this.dequeueJob(task);

    if (task.active) await this.queueJob(task);

    this.logger.debug(`${this.constructor.name}: Task (ID: ${id}, Name: ${name}) updated.`);
  }

  /**
   * Remove task's job from queue
   *
   * @param {Task} task
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async removeJob(task: Task): Promise<void> {
    const { id, name } = task;

    await this.dequeueJob(task);

    this.logger.debug(`${this.constructor.name}: Task (ID: ${id}, Name: ${name}) removed.`);
  }

  /**
   * Add task's job to queue
   *
   * @param {Task} task
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async runJob(task: Task): Promise<void> {
    const { id, name, job: jobType } = task;

    if (!validate(jobType)) {
      this.logger.warn(`${this.constructor.name}: Job "${jobType}" not found in job definitions.`);
      return;
    }

    await this.queue.add(name, { jobType }, { delay: 1000 });

    this.logger.debug(`${this.constructor.name}: Task (ID: ${id}, Name: ${name}) queued.`);
  }

  /**
   * Pause all scheduled tasks in queue
   *
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async pauseAll(): Promise<void> {
    await this.clearRepeatableJobs();
  }

  /**
   * Resume all scheduled tasks in queue
   *
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async resumeAll(): Promise<void> {
    await this.loadRepeatableJobs();
  }
}
