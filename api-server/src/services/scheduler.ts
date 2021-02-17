import type { IoC } from '@/ioc';

export default class Scheduler {
  private readonly config;

  private readonly logger;

  public readonly jobs;

  public readonly tasks;

  constructor({
    config,
    logger,
    jobsQueueHandler,
    tasksQueueHandler,
  }: Pick<IoC, 'config' | 'logger' | 'jobsQueueHandler' | 'tasksQueueHandler'>) {
    this.config = config;
    this.logger = logger;

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
    const { redis } = this.config.queue;

    await this.jobs.init(redis);
    await this.tasks.init(redis);

    this.logger.info(`Scheduler has been loaded.`);
  }
}
