import config from '@/config/queue';
import logger from '@/services/logger';
import JobQueueHandler from './queues/jobs-queue-handler';
import TasksQueueHandler from './queues/tasks-queue-handler';

class Scheduler {
  public jobs!: JobQueueHandler;

  public tasks!: TasksQueueHandler;

  /**
   * Initialize scheduler
   *
   * @returns {Promise<void>}
   * @memberof Scheduler
   */
  public async init(): Promise<void> {
    const { redis } = config;

    this.jobs = new JobQueueHandler('it24-jobs');
    await this.jobs.init(redis);

    this.tasks = new TasksQueueHandler('it24-tasks');
    await this.tasks.init(redis);

    logger.info(`Scheduler has been loaded.`);
  }
}

export default new Scheduler();
