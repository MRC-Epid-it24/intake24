import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';
import { SystemLocale } from '@intake24/db';

import BaseJob from '../job';

export default class LocaleIndexBuild extends BaseJob<'LocaleIndexBuild'> {
  readonly name = 'LocaleIndexBuild';
  private readonly cacheKey = 'indexing-locales';

  private readonly reindexingProcessService;
  private readonly reindexingPublisherService;

  constructor({
    cache,
    logger,
    reindexingPublisherService,
  }: Pick<IoC, 'cache' | 'logger' | 'reindexingPublisherService'>) {
    super({ logger });

    this.reindexingProcessService = cache;
    this.reindexingPublisherService = reindexingPublisherService;
  }

  private isLocaleIdOrCode(value: string): boolean {
    return !Number.isNaN(Number(value));
  }

  private async resolveLocale(localeId: string): Promise<string> {
    const locale
      = typeof localeId === 'string'
        ? await SystemLocale.findByPk(localeId, { attributes: ['code'] })
        : localeId;
    if (!locale)
      throw new NotFoundError();

    return locale.code;
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

    let locales = localeIds;

    if (!locales.includes('all')) {
      locales = await Promise.all(
        locales.map((locale) => {
          if (this.isLocaleIdOrCode(locale))
            return this.resolveLocale(locale);

          return locale;
        }),
      );
    }

    this.logger.debug(`Publish Information for the Rebuilding Specified Indexes: ${locales}...`);
    await this.reindexingPublisherService.publish(locales);

    this.logger.debug('Job finished.');
  }
}
