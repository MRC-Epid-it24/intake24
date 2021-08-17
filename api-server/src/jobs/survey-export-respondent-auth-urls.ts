import { format as formatDate } from 'date-fns';
import fs from 'fs-extra';
import json2csv, { Transform } from 'json2csv';
import { trimEnd } from 'lodash';
import path from 'path';
import { SurveyExportRespondentAuthUrlsParams } from '@common/types';
import { JobsOptions } from 'bullmq';
import { Job, Survey, UserSurveyAlias } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { addTime } from '@/util';
import BaseJob from './job';

export default class SurveyExportRespondentAuthUrls extends BaseJob<SurveyExportRespondentAuthUrlsParams> {
  readonly name = 'SurveyExportRespondentAuthUrls';

  private job!: Job;

  private readonly appConfig;

  private readonly fsConfig;

  constructor({ appConfig, fsConfig, logger }: Pick<IoC, 'appConfig' | 'fsConfig' | 'logger'>) {
    super({ logger });

    this.appConfig = appConfig;
    this.fsConfig = fsConfig;
  }

  /**
   * Run the task
   *
   * @param {string} jobId
   * @param {SurveyExportRespondentAuthUrlsParams} params
   * @param {JobsOptions} ops
   * @returns {Promise<void>}
   * @memberof SurveyExportRespondentAuthUrls
   */
  public async run(
    jobId: string,
    params: SurveyExportRespondentAuthUrlsParams,
    ops: JobsOptions
  ): Promise<void> {
    this.init(jobId, params, ops);

    const job = await Job.findByPk(jobId);
    if (!job) throw new NotFoundError(`Job ${this.name}: Job record not found (${jobId}).`);

    this.job = job;

    this.logger.debug(`Job ${this.name} | ${jobId} started.`);

    await this.download();

    this.logger.debug(`Job ${this.name} | ${jobId} finished.`);
  }

  /**
   *
   *
   * @private
   * @returns {Promise<void>}
   * @memberof SurveyExportRespondentAuthUrls
   */
  private async download(): Promise<void> {
    const { surveyId } = this.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey)
      throw new NotFoundError(`Job ${this.name}: Survey record not found (${surveyId}).`);

    const timestamp = formatDate(new Date(), 'yyyyMMdd-HHmmss');
    const baseFrontendURL = trimEnd(
      survey.authUrlDomainOverride ?? this.appConfig.urls.survey,
      '/'
    );

    const fields: json2csv.FieldInfo<UserSurveyAlias>[] = [
      { label: 'UserID', value: 'userId' },
      { label: 'Username', value: 'userName' },
      { label: 'AuthenticationCode', value: (row: UserSurveyAlias) => row.urlAuthToken },
      {
        label: 'AuthenticationURL',
        value: (row: UserSurveyAlias) => `${baseFrontendURL}/${surveyId}/${row.urlAuthToken}`,
      },
    ];

    const filename = `intake24-${surveyId}-auth-urls-${timestamp}.csv`;

    return new Promise((resolve, reject) => {
      const transform = new Transform({ fields, withBOM: true });
      const output = fs.createWriteStream(path.resolve(this.fsConfig.local.downloads, filename), {
        encoding: 'utf8',
        flags: 'w+',
      });

      const aliases = UserSurveyAlias.findAllWithStream({ where: { surveyId } });

      aliases.on('error', (err) => reject(err));

      transform
        .on('error', (err) => reject(err))
        .on('end', async () => {
          const downloadUrlExpiresAt = addTime(this.fsConfig.urlExpiresAt);
          await this.job.update({ downloadUrl: filename, downloadUrlExpiresAt });
          resolve();
        });

      aliases.pipe(transform).pipe(output);
    });
  }
}
