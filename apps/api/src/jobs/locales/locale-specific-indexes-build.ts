import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocaleSpecificIndexBuild extends BaseJob<'LocaleSpecificIndexBuild'> {
  readonly name = 'LocaleSpecificIndexBuild';

  private readonly localeIndexBuildService;
  private readonly redisSetService;
  private localeIds: string[] | undefined;

  constructor({
    logger,
    foodSearchController,
    redisSetService,
  }: Pick<IoC, 'logger' | 'foodSearchController' | 'redisSetService'>) {
    super({ logger });

    this.localeIndexBuildService = foodSearchController;
    this.redisSetService = redisSetService;
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
    this.redisSetService.init();

    this.logger.debug('Job started.');

    if ((await this.redisSetService.getSetSize()) === 0) {
      this.logger.debug('No locales specified. No Rebuilding is necessary');
      this.redisSetService.close();
      return;
    }

    this.logger.debug('\nReading Locale Ids from Redis Stream...');
    const localeIds = await this.redisSetService.readSet();
    this.logger.debug('\n\nLocale Ids:', localeIds);

    this.logger.debug('Starting Rebuildng Specified Indexes...');
    if (localeIds && localeIds.length > 0) {
      await this.localeIndexBuildService.rebuildFoodIndexJob(localeIds);
    } else {
      this.logger.debug('No locales specified. No Rebuilding is necessary');
    }

    //Need to close the connection to the Redis Stream
    //await this.redisSetService.close();
    this.logger.debug('Job finished.');
  }
}
