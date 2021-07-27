import axios from 'axios';
import { Survey, SurveySubmission } from '@/db/models/system';
import { submissionScope } from '@/db/models/system/survey-submission';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { SurveySubmissionNotificationParams } from '@common/types';
import { JobsOptions } from 'bullmq';
import BaseJob from './job';

export default class SurveySubmissionNotification extends BaseJob<SurveySubmissionNotificationParams> {
  readonly name = 'SurveySubmissionNotification';

  constructor({ logger }: Pick<IoC, 'logger'>) {
    super({ logger });
  }

  /**
   * Run the task
   *
   * @param {string} jobId
   * @param {SurveySubmissionNotificationParams} params
   * @param {JobsOptions} ops
   * @returns {Promise<void>}
   * @memberof SurveySubmissionNotification
   */
  public async run(
    jobId: string,
    params: SurveySubmissionNotificationParams,
    ops: JobsOptions
  ): Promise<void> {
    this.init(jobId, params, ops);

    this.logger.debug(`Job ${this.name} | ${jobId} started.`);

    await this.sendSubmissionNotification();

    this.logger.debug(`Job ${this.name} | ${jobId} finished.`);
  }

  /**
   *
   *
   * @private
   * @returns {Promise<void>}
   * @memberof SurveySubmissionNotification
   */
  private async sendSubmissionNotification(): Promise<void> {
    const { surveyId, submissionId } = this.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError('Survey not found');

    const { submissionNotificationUrl } = survey;
    if (!submissionNotificationUrl) {
      this.logger.warn(
        `Job ${this.name} | ${this.jobId}: submission notification url not set for survey ${surveyId}`
      );
      return;
    }

    const submission = await SurveySubmission.findByPk(submissionId, submissionScope(surveyId));
    if (!submission) throw new NotFoundError('Submission not found');

    const client = axios.create();
    await client.post(submissionNotificationUrl, submission);
  }
}
