import type { Job } from 'bullmq';

import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';
import { Job as DbJob } from '@intake24/db';

import BaseJob from '../job';

export default class SurveyNutrientsRecalculation extends BaseJob<'SurveyNutrientsRecalculation'> {
  readonly name = 'SurveyNutrientsRecalculation';

  private dbJob!: DbJob;

  private readonly appConfig;

  constructor({ appConfig, logger }: Pick<IoC, 'appConfig' | 'logger'>) {
    super({ logger });

    this.appConfig = appConfig;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveyNutrientsRecalculation
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    const dbJob = await DbJob.findByPk(this.dbId);
    if (!dbJob) throw new NotFoundError(`Job ${this.name}: Job record not found (${this.dbId}).`);

    this.dbJob = dbJob;

    this.logger.debug('Job started.');

    this.logger.debug('Job finished.');
  }
}
