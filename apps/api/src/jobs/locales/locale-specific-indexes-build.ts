import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocaleSpecificIndexBuild extends BaseJob<'LocaleSpecificIndexBuild'> {
  readonly name = 'LocaleSpecificIndexBuild';

  // private readonly localeIndexBuildService;
  private readonly redisIndexingProcessService;
  private localeIds: string[] | undefined;

  constructor({
    logger,
    redisIndexingProcessService,
  }: Pick<IoC, 'logger' | 'foodSearchController' | 'redisIndexingProcessService'>) {
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

    this.logger.info('\nReading Locale Ids from Redis Set...');
    const localeIds = await this.redisIndexingProcessService.readSet();
    this.logger.debug('\n\nLocale Ids:', localeIds);

    await this.redisIndexingProcessService.removeSet();

    this.logger.debug(`\nPublish Information for the Rebuildng Specified Indexes: ${localeIds}...`);
    const resultPub = await this.redisIndexingProcessService.publish(localeIds);
    this.logger.debug('\n\nPublish Result:', resultPub);
    // this.logger.debug('Starting Rebuildng Specified Indexes...');
    // await this.localeIndexBuildService.rebuildFoodIndexJob(localeIds);
    this.redisIndexingProcessService.close();
    this.logger.debug('Job finished.');
  }
}
