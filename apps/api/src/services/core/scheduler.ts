import type { IoC } from '@intake24/api/ioc';

export default class Scheduler {
  private readonly queueConfig;

  private readonly logger;

  public readonly jobs;

  public readonly tasks;

  constructor({
    queueConfig,
    logger,
    jobsQueueHandler,
    tasksQueueHandler,
  }: Pick<IoC, 'queueConfig' | 'logger' | 'jobsQueueHandler' | 'tasksQueueHandler'>) {
    this.queueConfig = queueConfig;
    this.logger = logger.child({ service: 'Scheduler' });

    this.jobs = jobsQueueHandler;
    this.tasks = tasksQueueHandler;
  }

  /**
   * Initialize scheduler
   *
   * @returns {Promise<void>}
   * @memberof Scheduler
   */
  public async init(): Promise<void> {
    const { redis } = this.queueConfig;

    await Promise.all([this.jobs.init(redis), this.tasks.init(redis)]);

    this.logger.info(`Scheduler has been loaded.`);
  }

  /**
   * Close all connections
   *
   * @returns {Promise<void>}
   * @memberof Scheduler
   */
  public async close(): Promise<void> {
    await Promise.all([this.jobs.close(), this.tasks.close()]);

    this.logger.info(`Scheduler has closed all connections.`);
  }

  /**
   * Close all workers before shutdown
   *
   * @returns {Promise<void>}
   * @memberof Scheduler
   */
  public async closeWorkers(): Promise<void> {
    await Promise.all([this.jobs.closeWorkers(), this.tasks.closeWorkers()]);

    this.logger.info('Scheduler workers were shutdown.');
  }
}
