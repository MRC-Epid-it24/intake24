import type { Job } from 'bullmq';
import { format as formatDate } from 'date-fns';
import fs from 'fs-extra';
import json2csv, { Transform } from 'json2csv';
import path from 'path';
import type { SurveyExportRespondentAuthUrlsParams } from '@intake24/common/types';
import { Job as DbJob, Survey, UserSurveyAlias } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import { addTime, getFrontEndUrl } from '@intake24/api/util';
import BaseJob from './job';

export default class SurveyExportRespondentAuthUrls extends BaseJob<SurveyExportRespondentAuthUrlsParams> {
  readonly name = 'SurveyExportRespondentAuthUrls';

  private dbJob!: DbJob;

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
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveyExportRespondentAuthUrls
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    const dbJob = await DbJob.findByPk(this.id);
    if (!dbJob) throw new NotFoundError(`Job ${this.name}: Job record not found (${this.id}).`);

    this.dbJob = dbJob;

    this.logger.debug('Job started.');

    await this.download();

    this.logger.debug('Job finished.');
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

    const { slug, authUrlDomainOverride } = survey;
    const timestamp = formatDate(new Date(), 'yyyyMMdd-HHmmss');
    const baseFrontendURL = getFrontEndUrl(
      this.appConfig.urls.base,
      this.appConfig.urls.survey,
      authUrlDomainOverride
    );

    const fields: json2csv.FieldInfo<UserSurveyAlias>[] = [
      { label: 'UserID', value: 'userId' },
      { label: 'Username', value: 'username' },
      { label: 'AuthenticationCode', value: (row: UserSurveyAlias) => row.urlAuthToken },
      {
        label: 'SurveyAuthenticationURL',
        value: (row: UserSurveyAlias) => `${baseFrontendURL}/${slug}?token=${row.urlAuthToken}`,
      },
      {
        label: 'FeedbackAuthenticationURL',
        value: (row: UserSurveyAlias) =>
          `${baseFrontendURL}/${slug}/feedback?token=${row.urlAuthToken}`,
      },
    ];

    const filename = `intake24-${slug}-auth-urls-${timestamp}.csv`;

    const total = await UserSurveyAlias.count({ where: { surveyId } });
    const aliases = UserSurveyAlias.findAllWithStream({ where: { surveyId } });

    this.initProgress(total);

    let counter = 0;
    const progressInterval = setInterval(() => {
      this.setProgress(counter);
    }, 1500);

    return new Promise((resolve, reject) => {
      const transform = new Transform({ fields, withBOM: true });
      const output = fs.createWriteStream(path.resolve(this.fsConfig.local.downloads, filename), {
        encoding: 'utf8',
        flags: 'w+',
      });

      aliases.on('error', (err) => reject(err));

      transform
        .on('error', (err) => reject(err))
        .on('data', () => {
          counter++;
        })
        .on('end', async () => {
          clearInterval(progressInterval);

          const downloadUrlExpiresAt = addTime(this.fsConfig.urlExpiresAt);
          await this.dbJob.update({ downloadUrl: filename, downloadUrlExpiresAt });

          resolve();
        });

      aliases.pipe(transform).pipe(output);
    });
  }
}
