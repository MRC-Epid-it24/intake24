import type { IoC } from '@/ioc';

export default class Scheduler {
  private config;

  private logger;

  public jobs;

  public tasks;

  constructor({ config, logger, jobsQueueHandler, tasksQueueHandler }: IoC) {
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
