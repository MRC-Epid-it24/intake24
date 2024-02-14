import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocaleSpecificIndexBuild extends BaseJob<'LocaleSpecificIndexBuild'> {
  readonly name = 'LocaleSpecificIndexBuild';

  // private readonly localeIndexBuildService;
  private readonly redisIndexingProcessService;

  constructor({
    logger,
    redisIndexingProcessService,
  }: Pick<IoC, 'logger' | 'redisIndexingProcessService'>) {
    super({ logger });

    // this.localeIndexBuildService = foodSearchController;
    this.redisIndexingProcessService = redisIndexingProcessService;
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
    this.redisIndexingProcessService.init();

    this.logger.debug('Job started.');

    if ((await this.redisIndexingProcessService.getSetSize()) === 0) {
      this.logger.info('No locales specified. No Rebuilding is necessary');
      this.redisIndexingProcessService.close();
      return;
    }

    this.logger.info('Reading Locale Ids from Redis Set...');
    const localeIds = await this.redisIndexingProcessService.readSet();
    this.logger.debug('Locale Ids:', localeIds);

    await this.redisIndexingProcessService.removeSet();

    this.logger.debug(`Publish Information for the Rebuildng Specified Indexes: ${localeIds}...`);
    const resultPub = await this.redisIndexingProcessService.publish(localeIds);
    this.logger.debug('Publish Result:', resultPub);

    this.redisIndexingProcessService.close();
    this.logger.debug('Job finished.');
  }
}
