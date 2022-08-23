import type { Job } from 'bullmq';
import axios from 'axios';

import type { IoC } from '@intake24/api/ioc';
import type { Dictionary } from '@intake24/common/types';
import { NotFoundError } from '@intake24/api/http/errors';
import { submissionScope, Survey, SurveySubmission } from '@intake24/db';

import BaseJob from './job';

export default class SurveySubmissionNotification extends BaseJob<'SurveySubmissionNotification'> {
  readonly name = 'SurveySubmissionNotification';

  private readonly jwtService;

  constructor({ logger, jwtService }: Pick<IoC, 'logger' | 'jwtService'>) {
    super({ logger });

    this.jwtService = jwtService;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveySubmissionNotification
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    await this.sendSubmissionNotification();

    this.logger.debug('Job finished.');
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

    const { submissionNotificationUrl, genUserKey } = survey;
    if (!submissionNotificationUrl) {
      this.logger.warn(`Submission notification url not set for survey ${surveyId}`);
      return;
    }

    const submission = await SurveySubmission.findByPk(submissionId, submissionScope({ surveyId }));
    if (!submission) throw new NotFoundError('Submission not found');

    const headers: Dictionary = {};
    if (genUserKey) {
      const token = await this.jwtService.sign({ submissionId }, genUserKey, {
        audience: submissionNotificationUrl,
        expiresIn: '1m',
      });
      headers.authorization = `Bearer ${token}`;
    }

    const client = axios.create({ headers });
    await client.post(submissionNotificationUrl, submission);
  }
}
