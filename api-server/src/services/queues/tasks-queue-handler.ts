import { ConnectionOptions, Job as BullJob, Queue, QueueScheduler, Worker } from 'bullmq';
import Task from '@/db/models/system/task';
import jobs, { validate } from '@/jobs';
import logger from '@/services/logger';
import { JobType } from '@/jobs/job';
import { QueueHandler } from './queue-handler';

export type TaskData = { jobType: JobType };

export default class TasksQueueHandler implements QueueHandler {
  readonly name: string;

  queue!: Queue<TaskData>;

  scheduler!: QueueScheduler;

  worker!: Worker<TaskData>;

  /**
   * Creates an instance of TasksQueueHandler
   *
   * @param {string} name
   * @memberof TasksQueueHandler
   */
  constructor(name: string) {
    this.name = name;
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

    this.queue = new Queue(this.name, { connection });

    this.worker = new Worker(this.name, this.processor, { connection });

    this.worker.on('completed', (job: BullJob<TaskData>) => {
      logger.info(`${this.name}: ${job.id} has completed.`);
    });

    this.worker.on('failed', (job: BullJob<TaskData>, err) => {
      logger.error(`${this.name}: ${job.id} has failed with ${err.message}`);
    });

    await this.clearRepeatableJobs();
    await this.loadRepeatableJobs();

    logger.info(`${this.name} has been loaded.`);
  }

  // eslint-disable-next-line class-methods-use-this
  async processor({ data }: BullJob<TaskData>): Promise<void> {
    const newJob = new jobs[data.jobType](data);
    await newJob.run();
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

    await this.queue.add(
      name,
      { jobType },
      { removeOnComplete: true, removeOnFail: true, repeat: { cron } }
    );
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
      logger.warn(`${this.name}: Job "${job}" not found in job definitions.`);
      return;
    }

    if (!active) {
      logger.warn(`${this.name}: Task (ID: ${id}, Name: ${name}) not set as active.`);
      return;
    }

    await this.queueJob(task);

    logger.debug(`${this.name}: Task (ID: ${id}, Name: ${name}) added.`);
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
      logger.warn(`${this.name}: Job "${job}" not found in job definitions.`);
      return;
    }

    await this.dequeueJob(task);

    if (task.active) await this.queueJob(task);

    logger.debug(`${this.name}: Task (ID: ${id}, Name: ${name}) updated.`);
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

    logger.debug(`${this.name}: Task (ID: ${id}, Name: ${name}) removed.`);
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
      logger.warn(`${this.name}: Job "${jobType}" not found in job definitions.`);
      return;
    }

    await this.queue.add(name, { jobType }, { delay: 500 });

    logger.debug(`${this.name}: Task (ID: ${id}, Name: ${name}) queued.`);
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
