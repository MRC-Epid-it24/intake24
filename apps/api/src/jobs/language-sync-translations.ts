import type { Job } from 'bullmq';
import type { JobParams } from '@intake24/common/types';
import type { IoC } from '@intake24/api/ioc';
import BaseJob from './job';

export default class LanguageSyncTranslations extends BaseJob<
  JobParams['LanguageSyncTranslations']
> {
  readonly name = 'LanguageSyncTranslations';

  private readonly languageService;

  constructor({ logger, languageService }: Pick<IoC, 'logger' | 'languageService'>) {
    super({ logger });

    this.languageService = languageService;
  }

  /**
  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveyImportRespondents
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    await this.languageService.syncLanguageTranslations();

    this.logger.debug('Job finished.');
  }
}
