import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocaleSpecificIndexBuild extends BaseJob<'LocaleSpecificIndexBuild'> {
  readonly name = 'LocaleSpecificIndexBuild';
  private readonly cacheKey = 'indexing-locales';

  // private readonly localeIndexBuildService;
  private readonly redisIndexingProcessService;
  private readonly redisIndexingPublisherService;

  constructor({
    cache,
    logger,
    redisIndexingPublisherService,
  }: Pick<IoC, 'cache' | 'logger' | 'redisIndexingPublisherService'>) {
    super({ logger });

    this.redisIndexingProcessService = cache;
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

    this.logger.debug('Job started.');

    // if ((await this.redisIndexingProcessService.has(this.cacheKey)) === false) {
    //   this.logger.info('No indexing key presented. No Rebuilding is necessary');
    //   return;
    // }
    const localeIds = await this.redisIndexingProcessService.get<string[]>('indexing-locales');
    if (!localeIds || localeIds.length === 0) {
      this.logger.info('No locales specified. No Rebuilding is necessary');
      return;
    }
    this.logger.debug('Locale Ids for rebuilding:', localeIds);
    this.redisIndexingProcessService.forget(this.cacheKey);

    this.redisIndexingPublisherService.init();

    this.logger.debug(`Publish Information for the Rebuildng Specified Indexes: ${localeIds}...`);
    await this.redisIndexingPublisherService.publish(localeIds);

    this.redisIndexingPublisherService.close();
    this.logger.debug('Job finished.');
  }
}
