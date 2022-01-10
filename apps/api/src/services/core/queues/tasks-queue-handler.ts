import { ConnectionOptions, Job as BullJob, Queue, QueueScheduler, Worker } from 'bullmq';
import { JobData, RepeatableBullJob } from '@intake24/common/types';
import { Task } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import ioc from '@intake24/api/ioc';
import { Job } from '@intake24/api/jobs';
import { sleep } from '@intake24/api/util';
import { QueueHandler } from './queue-handler';

export default class TasksQueueHandler implements QueueHandler<JobData> {
  readonly name = 'it24-tasks';

  private readonly logger;

  queue!: Queue<JobData>;

  scheduler!: QueueScheduler;

  workers: Worker<JobData>[] = [];

  /**
   * Creates an instance of TasksQueueHandler.
   * @param {IoC} { logger }
   * @memberof TasksQueueHandler
   */
  constructor({ logger }: Pick<IoC, 'logger'>) {
    this.logger = logger.child({ service: 'TasksQueueHandler' });
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

    worker
      .on('completed', (job) => {
        this.logger.info(`${this.name}: ${job.name} | ${job.id} has completed.`);
      })
      .on('failed', (job, err) => {
        this.logger.error(`${this.name}: ${job.name} | ${job.id} has failed with ${err.message}`);
      })
      .on('error', (err) => {
        const { message, name, stack } = err;
        this.logger.error(stack ?? `${name}: ${message}`);
      });

    this.workers.push(worker);

    await this.clearRepeatableJobs();
    await this.loadRepeatableJobs();

    this.logger.info(`${this.name} has been loaded.`);
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

  async processor(job: BullJob<JobData>): Promise<void> {
    const { id, name } = job;

    if (!id) {
      this.logger.error(`Queue ${this.name}: Job ID missing.`);
      return;
    }

    const newJob = ioc.resolve<Job>(name);
    await newJob.run(job);
  }

  async getRepeatableJobById(id: string): Promise<RepeatableBullJob | undefined> {
    const jobs = await this.queue.getRepeatableJobs();

    return jobs.find((job) => job.id === id);
  }

  /**
   * Remove repeatable job(s) from queue
   *
   * @private
   * @param {string} [id]
   * @memberof TasksQueueHandler
   */
  private async clearRepeatableJobs(id?: string) {
    const repeatableJobs = await this.queue.getRepeatableJobs();

    for (const job of repeatableJobs) {
      if (id && job.id !== id) continue;

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
    const { id, job, cron, params } = task;

    await this.queue.add(job, { params }, { repeat: { cron }, jobId: id.toString() });
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
    this.clearRepeatableJobs(task.id.toString());
  }

  /**
   * Add task's job to queue
   *
   * @param {Task} task
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async addJob(task: Task): Promise<void> {
    const { id, name, active } = task;

    if (!active) {
      this.logger.warn(`Queue ${this.name}: Task (ID: ${id}, Name: ${name}) not set as active.`);
      return;
    }

    await this.queueJob(task);

    this.logger.debug(`Queue ${this.name}: Task (ID: ${id}, Name: ${name}) added.`);
  }

  /**
   * Update task's job to queue
   *
   * @param {Task} task
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async updateJob(task: Task): Promise<void> {
    const { id, name, active } = task;

    await this.dequeueJob(task);

    /*
     * Bullmq bug
     * When repeatable job removed right away and new job pushed in, job entry doesn't end up in redis store
     * Though queue.add returns correct job entry
     * Workaround: simple sleep/wait for few ms solves it for now
     */
    await sleep(20);

    if (active) await this.queueJob(task);

    this.logger.debug(`Queue ${this.name}: Task (ID: ${id}, Name: ${name}) updated.`);
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

    this.logger.debug(`Queue ${this.name}: Task (ID: ${id}, Name: ${name}) removed.`);
  }

  /**
   * Add task's job to queue
   *
   * @param {Task} task
   * @returns {Promise<void>}
   * @memberof TasksQueueHandler
   */
  public async runJob(task: Task): Promise<void> {
    const { id, name, job, params } = task;

    await this.queue.add(job, { params }, { delay: 500 });

    this.logger.debug(`Queue ${this.name}: Task (ID: ${id}, Name: ${name}) queued.`);
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
