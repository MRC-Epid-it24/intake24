import fecha from 'fecha';
import fs from 'fs-extra';
import json2csv, { parseAsync } from 'json2csv';
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

  private config;

  private logger;

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

    // TODO: stream from DB to file for large data sets
    const aliases = await UserSurveyAlias.findAll({ where: { surveyId } });

    const csv = await parseAsync(aliases, { fields });
    const filename = `intake24-${surveyId}-auth-urls-${timestamp}.csv`;

    await fs.writeFile(path.resolve(this.config.filesystem.local.downloads, filename), csv, {
      encoding: 'utf8',
      flag: 'w+',
    });

    // TODO: make it configurable
    const downloadUrlExpiresAt = new Date();
    downloadUrlExpiresAt.setDate(downloadUrlExpiresAt.getDate() + 1);

    await job.update({ downloadUrl: filename, downloadUrlExpiresAt });
  }
}
