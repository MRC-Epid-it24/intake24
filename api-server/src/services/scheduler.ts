import config from '@/config/queue';
import logger from '@/services/logger';
import MailQueueHandler from './queues/mail-queue-handler';
import TasksQueueHandler from './queues/tasks-queue-handler';

class Scheduler {
  public mail!: MailQueueHandler;

  public tasks!: TasksQueueHandler;

  /**
   * Initialize scheduler
   *
   * @returns {Promise<void>}
   * @memberof Scheduler
   */
  public async init(): Promise<void> {
    const { redis } = config;

    this.mail = new MailQueueHandler('it24-mail');
    await this.mail.init(redis);

    this.tasks = new TasksQueueHandler('it24-tasks');
    await this.tasks.init(redis);

    logger.info(`Scheduler has been loaded.`);
  }
}

export default new Scheduler();
