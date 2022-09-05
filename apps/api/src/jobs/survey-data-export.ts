import path from 'node:path';

import type { Job } from 'bullmq';
import fs from 'fs-extra';
import { Transform } from 'json2csv';

import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';
import { EMPTY } from '@intake24/api/services/admin/data-export';
import { addTime } from '@intake24/api/util';
import { Job as DbJob } from '@intake24/db';

import BaseJob from './job';

export default class SurveyDataExport extends BaseJob<'SurveyDataExport'> {
  readonly name = 'SurveyDataExport';

  private dbJob!: DbJob;

  private readonly dataExportService;

  private readonly fsConfig;

  constructor({
    fsConfig,
    dataExportService,
    logger,
  }: Pick<IoC, 'fsConfig' | 'dataExportService' | 'logger'>) {
    super({ logger });

    this.fsConfig = fsConfig;
    this.dataExportService = dataExportService;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveyDataExport
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    const dbJob = await DbJob.findByPk(this.id);
    if (!dbJob) throw new NotFoundError(`Job ${this.name}: Job record not found (${this.id}).`);

    this.dbJob = dbJob;

    this.logger.debug('Job started.');

    await this.exportData();

    this.logger.debug('Job finished.');
  }

  /**
   *
   *
   * @private
   * @returns {Promise<void>}
   * @memberof SurveyDataExport
   */
  private async exportData(): Promise<void> {
    const { options, fields, filename, total } = await this.dataExportService.prepareExportInfo(
      this.params
    );

    this.initProgress(total);

    let counter = 0;
    const progressInterval = setInterval(() => {
      this.setProgress(counter);
    }, 1500);

    return new Promise((resolve, reject) => {
      const filepath = path.resolve(this.fsConfig.local.downloads, filename);
      const output = fs.createWriteStream(filepath, { encoding: 'utf8', flags: 'w+' });

      const foods = this.dataExportService.getSubmissionsWithStream(options);
      const transform = new Transform({ fields, defaultValue: EMPTY, withBOM: true });

      foods.on('error', (err) => {
        clearInterval(progressInterval);
        reject(err);
      });

      transform
        .on('error', (err) => {
          clearInterval(progressInterval);
          reject(err);
        })
        .on('data', () => {
          counter++;
        })
        .on('end', async () => {
          clearInterval(progressInterval);

          const downloadUrlExpiresAt = addTime(this.fsConfig.urlExpiresAt);
          await this.dbJob.update({ downloadUrl: filename, downloadUrlExpiresAt });

          resolve();
        });

      foods.pipe(transform).pipe(output);
    });
  }
}
