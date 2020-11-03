import config from '@/config/queue';
import logger from '@/services/logger';
import TasksQueueHandler from './queues/tasks-queue-handler';

class Scheduler {
  public tasks!: TasksQueueHandler;

  /**
   * Initialize scheduler
   *
   * @returns {Promise<void>}
   * @memberof Scheduler
   */
  public async init(): Promise<void> {
    const { redis } = config;

    this.tasks = new TasksQueueHandler('it24-tasks');
    await this.tasks.init(redis);

    logger.info(`Scheduler has been loaded.`);
  }
}

export default new Scheduler();
