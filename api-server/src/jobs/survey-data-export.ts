import fs from 'fs-extra';
import path from 'path';
import { Transform } from 'json2csv';
import { Job } from '@/db/models/system';
import type { IoC } from '@/ioc';
import { NotFoundError } from '@/http/errors';
import { DataExportInput, EMPTY } from '@/services/data-export';
import { getUrlExpireDate } from '@/util';
import { Job as BaseJob, JobData, JobType } from './job';

export type SurveyDataExportData = DataExportInput;

export default class SurveyDataExport implements BaseJob {
  public readonly name: JobType = 'SurveyDataExport';

  private readonly dataExportService;

  private readonly config;

  private readonly logger;

  private jobId!: number;

  private data!: SurveyDataExportData;

  constructor({ config, dataExportService, logger }: IoC) {
    this.config = config;
    this.dataExportService = dataExportService;
    this.logger = logger;
  }

  /**
   * Run the job
   *
   * @param {JobData<SurveyDataExportData>} jobData
   * @returns {Promise<void>}
   * @memberof SurveyDataExport
   */
  public async run({ job, data }: JobData<SurveyDataExportData>): Promise<void> {
    this.data = data;
    this.jobId = job.id;

    this.logger.debug(`Job ${this.name} started.`);

    await this.exportData();

    this.logger.debug(`Job ${this.name} finished.`);
  }

  /**
   *
   *
   * @private
   * @returns {Promise<void>}
   * @memberof SurveyDataExport
   */
  private async exportData(): Promise<void> {
    const { options, fields, filename } = await this.dataExportService.prepareExportInfo(this.data);

    const job = await Job.findByPk(this.jobId);
    if (!job) throw new NotFoundError(`Job ${this.name}: Job record not found (${this.jobId}).`);

    return new Promise((resolve, reject) => {
      const filepath = path.resolve(this.config.filesystem.local.downloads, filename);
      const output = fs.createWriteStream(filepath, { encoding: 'utf8', flags: 'w+' });

      const foods = this.dataExportService.getSubmissionsWithStream(options);
      const transform = new Transform({ fields, defaultValue: EMPTY, withBOM: true });

      foods.on('error', (err) => reject(err));

      transform
        .on('error', (err) => reject(err))
        .on('end', async () => {
          const downloadUrlExpiresAt = getUrlExpireDate(this.config.filesystem.urlExpiresAt);
          await job.update({ downloadUrl: filename, downloadUrlExpiresAt });
          resolve();
        });

      foods.pipe(transform).pipe(output);
    });
  }
}
