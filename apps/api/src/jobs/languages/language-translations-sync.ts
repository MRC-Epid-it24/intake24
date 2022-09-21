import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';

import BaseJob from '../job';

export default class LanguageTranslationsSync extends BaseJob<'LanguageTranslationsSync'> {
  readonly name = 'LanguageTranslationsSync';

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
   * @memberof SurveyRespondentsImport
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    await this.languageService.syncLanguageTranslations();

    this.logger.debug('Job finished.');
  }
}
