import { Job } from 'bullmq';
import type { SyncLanguageTranslationsParams } from '@intake24/common/types';
import type { IoC } from '@intake24/api/ioc';
import BaseJob from './job';

export default class SynchronizeLanguageMessages extends BaseJob<SyncLanguageTranslationsParams> {
  readonly name = 'SynchronizeLanguageMessages';

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
