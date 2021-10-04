import type { IoC } from '@api/ioc';

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

    await this.jobs.init(redis);
    await this.tasks.init(redis);

    this.logger.info(`Scheduler has been loaded.`);
  }

  /**
   * Close all connections
   *
   * @returns {Promise<void>}
   * @memberof Scheduler
   */
  public async close(): Promise<void> {
    await this.jobs.close();
    await this.tasks.close();

    this.logger.info(`Scheduler has closed all connections.`);
  }
}
