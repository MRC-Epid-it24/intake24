import fs from 'fs-extra';
import path from 'path';
import { Transform } from 'json2csv';
import { SurveyDataExportParams } from '@common/types';
import { JobsOptions } from 'bullmq';
import { Job } from '@/db/models/system';
import type { IoC } from '@/ioc';
import { NotFoundError } from '@/http/errors';
import { EMPTY } from '@/services/data-export';
import { addTime } from '@/util';
import BaseJob from './job';

export default class SurveyDataExport extends BaseJob<SurveyDataExportParams> {
  readonly name = 'SurveyDataExport';

  private job!: Job;

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
   * @param {string} jobId
   * @param {SurveyDataExportParams} params
   * @param {JobsOptions} ops
   * @returns {Promise<void>}
   * @memberof SurveyDataExport
   */
  public async run(jobId: string, params: SurveyDataExportParams, ops: JobsOptions): Promise<void> {
    this.init(jobId, params, ops);

    const job = await Job.findByPk(jobId);
    if (!job) throw new NotFoundError(`Job ${this.name}: Job record not found (${jobId}).`);

    this.job = job;

    this.logger.debug(`Job ${this.name} | ${jobId} started.`);

    await this.exportData();

    this.logger.debug(`Job ${this.name} | ${jobId} finished.`);
  }

  /**
   *
   *
   * @private
   * @returns {Promise<void>}
   * @memberof SurveyDataExport
   */
  private async exportData(): Promise<void> {
    const { options, fields, filename } = await this.dataExportService.prepareExportInfo(
      this.params
    );

    return new Promise((resolve, reject) => {
      const filepath = path.resolve(this.fsConfig.local.downloads, filename);
      const output = fs.createWriteStream(filepath, { encoding: 'utf8', flags: 'w+' });

      const foods = this.dataExportService.getSubmissionsWithStream(options);
      const transform = new Transform({ fields, defaultValue: EMPTY, withBOM: true });

      foods.on('error', (err) => reject(err));

      transform
        .on('error', (err) => reject(err))
        .on('end', async () => {
          const downloadUrlExpiresAt = addTime(this.fsConfig.urlExpiresAt);
          await this.job.update({ downloadUrl: filename, downloadUrlExpiresAt });
          resolve();
        });

      foods.pipe(transform).pipe(output);
    });
  }
}
