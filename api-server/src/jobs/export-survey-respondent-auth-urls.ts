import fecha from 'fecha';
import fs from 'fs-extra';
import json2csv, { Transform } from 'json2csv';
import { trimEnd } from 'lodash';
import path from 'path';
import { Job, Survey, UserSurveyAlias } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { Job as BaseJob, JobData, JobType } from './job';

export type ExportSurveyRespondentAuthUrlsData = {
  surveyId: string;
};

export default class ExportSurveyRespondentAuthUrls implements BaseJob {
  public readonly name: JobType = 'ExportSurveyRespondentAuthUrls';

  private readonly config;

  private readonly logger;

  private jobId!: number;

  private data!: ExportSurveyRespondentAuthUrlsData;

  constructor({ config, logger }: IoC) {
    this.config = config;
    this.logger = logger;
  }

  /**
   * Run the job
   *
   * @return Promise<void>
   */
  public async run({ job, data }: JobData<ExportSurveyRespondentAuthUrlsData>): Promise<void> {
    this.data = data;
    this.jobId = job.id;

    this.logger.debug(`Job ${this.name} started.`);

    await this.download();

    this.logger.debug(`Job ${this.name} finished.`);
  }

  private async download(): Promise<void> {
    const { surveyId } = this.data;

    const survey = await Survey.findByPk(surveyId);
    if (!survey)
      throw new NotFoundError(`Job ${this.name}: Survey record not found (${surveyId}).`);

    const job = await Job.findByPk(this.jobId);
    if (!job) throw new NotFoundError(`Job ${this.name}: Job record not found (${this.jobId}).`);

    const timestamp = fecha.format(new Date(), 'YYYYMMDD-HHmmss');
    const baseFrontendURL = trimEnd(
      survey.authUrlDomainOverride ?? this.config.app.urls.survey,
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
      const opts = { fields, withBOM: true };
      const transform = new Transform(opts);
      const output = fs.createWriteStream(
        path.resolve(this.config.filesystem.local.downloads, filename),
        { encoding: 'utf8', flags: 'w+' }
      );

      const aliases = UserSurveyAlias.findAllWithStream({ where: { surveyId } });

      aliases.on('error', (err) => reject(err));

      transform
        .on('error', (err) => reject(err))
        .on('end', async () => {
          // TODO: make it configurable
          const downloadUrlExpiresAt = new Date();
          downloadUrlExpiresAt.setDate(downloadUrlExpiresAt.getDate() + 1);

          await job.update({ downloadUrl: filename, downloadUrlExpiresAt });
          resolve();
        });

      aliases.pipe(transform).pipe(output);
    });
  }
}
