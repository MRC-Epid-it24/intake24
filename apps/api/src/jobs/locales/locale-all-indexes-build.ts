import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocaleAllIndexBuild extends BaseJob<'LocaleAllIndexBuild'> {
  readonly name = 'LocaleAllIndexBuild';

  private readonly redisIndexingPublisherService;

  constructor({
    logger,
    redisIndexingPublisherService,
  }: Pick<IoC, 'logger' | 'redisIndexingPublisherService'>) {
    super({ logger });

    this.redisIndexingPublisherService = redisIndexingPublisherService;
  }

  /**
  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveyRespondentsImport
   */
  public async run(job: Job): Promise<void> {
    this.init(job);
    this.redisIndexingPublisherService.init();

    this.logger.debug('Job started.');
    this.logger.debug('Starting Rebuildng Indexes...');

    const resultPub = await this.redisIndexingPublisherService.publish(['all']);
    this.logger.debug('Publish Result:', resultPub);

    this.redisIndexingPublisherService.close();
    this.logger.debug('Job finished.');
  }
}
