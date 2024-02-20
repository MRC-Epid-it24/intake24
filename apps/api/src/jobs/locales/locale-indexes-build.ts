import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LocaleIndexBuild extends BaseJob<'LocaleIndexBuild'> {
  readonly name = 'LocaleIndexBuild';
  private readonly cacheKey = 'indexing-locales';

  private readonly reindexingProcessService;
  private readonly reindexingPublisherService;

  constructor({
    cache,
    logger,
    reindexingPublisherService: reindexingPublisherService,
  }: Pick<IoC, 'cache' | 'logger' | 'reindexingPublisherService'>) {
    super({ logger });

    this.reindexingProcessService = cache;
    this.reindexingPublisherService = reindexingPublisherService;
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

    const localeIds = await this.reindexingProcessService.get<string[]>('indexing-locales');
    if (!localeIds || localeIds.length === 0) {
      this.logger.info('No locales specified. No Rebuilding is necessary');
      return;
    }
    this.logger.debug('Locale Ids for rebuilding:', localeIds);
    this.reindexingProcessService.forget(this.cacheKey);

    this.reindexingPublisherService.init();

    this.logger.debug(`Publish Information for the Rebuildng Specified Indexes: ${localeIds}...`);
    await this.reindexingPublisherService.publish(localeIds);

    this.reindexingPublisherService.close();
    this.logger.debug('Job finished.');
  }
}
