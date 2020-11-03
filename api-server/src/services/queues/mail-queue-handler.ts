import { ConnectionOptions, Job, JobsOptions, Queue, QueueScheduler, Worker } from 'bullmq';
import { SendMailOptions } from 'nodemailer';
import mailer from '@/services/mailer';
import logger from '@/services/logger';
import { QueueHandler } from './queue-handler';

export type MailData = SendMailOptions;

export default class MailQueueHandler implements QueueHandler {
  readonly name: string;

  queue!: Queue<MailData>;

  scheduler!: QueueScheduler;

  worker!: Worker<MailData>;

  /**
   * Creates an instance of MailQueueHandler
   *
   * @param {string} name
   * @memberof MailQueueHandler
   */
  constructor(name: string) {
    this.name = name;
  }

  /**
   * Initialize MailQueueHandler
   *
   * @param {ConnectionOptions} connection
   * @returns {Promise<void>}
   * @memberof MailQueueHandler
   */
  async init(connection: ConnectionOptions): Promise<void> {
    this.scheduler = new QueueScheduler(this.name, { connection });

    this.queue = new Queue(this.name, { connection });

    this.worker = new Worker(this.name, this.processor, { connection });

    this.worker.on('completed', (job) => {
      logger.info(`${this.name}: ${job.id} has completed.`);
    });

    this.worker.on('failed', (job, err) => {
      logger.error(`${this.name}: ${job.id} has failed with ${err.message}`);
    });

    logger.info(`${this.constructor.name} has been loaded.`);
  }

  // eslint-disable-next-line class-methods-use-this
  async processor(job: Job<MailData>): Promise<void> {
    await mailer.sendMail(job.data);
  }

  /**
   * Send mail through the queue
   *
   * @param {string} name
   * @param {MailData} data
   * @param {JobsOptions} [opt={}]
   * @returns {Promise<void>}
   * @memberof MailQueueHandler
   */
  async send(name: string, data: MailData, opt: JobsOptions = {}): Promise<void> {
    await this.queue.add(name, data, opt);
  }
}
