import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocaleSpecificIndexBuild extends BaseJob<'LocaleSpecificIndexBuild'> {
  readonly name = 'LocaleSpecificIndexBuild';

  private readonly localeIndexBuildService;
  private readonly redisStreamService;
  private localeIds: string[] | undefined;

  constructor({
    logger,
    foodSearchController,
    redisStreamService,
  }: Pick<IoC, 'logger' | 'foodSearchController' | 'redisStreamService'>) {
    super({ logger });

    this.localeIndexBuildService = foodSearchController;
    this.redisStreamService = redisStreamService;
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

    this.logger.debug('Job started.');

    // this.logger.debug('\nAdding Locale Ids to Redis Stream...');
    // await this.redisStreamService.add('en_AU');
    // await this.redisStreamService.add('en_GB');
    // await this.redisStreamService.add('en_AU');

    this.logger.debug('\nReading Locale Ids from Redis Stream...');
    // NEED A FIX: Doesn't produce the expected result and the stream is not being read properly. Doesn't react on change to stub locales too.
    const localeIds = await this.redisStreamService.read();
    this.logger.debug('\n\nLocale Ids:', localeIds);

    this.logger.debug('Starting Rebuildng Specified Indexes...');
    if (localeIds && localeIds.length > 0) {
      await this.localeIndexBuildService.rebuildFoodIndexJob(localeIds);
    } else {
      this.logger.debug('No locales specified. No Rebuilding is necessary');
    }

    //Need to close the connection to the Redis Stream
    //await this.redisStreamService.close();
    this.logger.debug('Job finished.');
  }
}
