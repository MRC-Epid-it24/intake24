import type { Job } from 'bullmq';
import fs from 'fs-extra';
import nunjucks from 'nunjucks';
import type { SendRespondentFeedbackParams } from '@intake24/common/types';
import type { IoC } from '@intake24/api/ioc';
import BaseJob from './job';

export default class SendRespondentFeedback extends BaseJob<SendRespondentFeedbackParams> {
  readonly name = 'SendRespondentFeedback';

  private readonly feedbackService;

  private readonly mailer;

  constructor({
    feedbackService,
    logger,
    mailer,
  }: Pick<IoC, 'feedbackService' | 'logger' | 'mailer'>) {
    super({ logger });

    this.feedbackService = feedbackService;
    this.mailer = mailer;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SendRespondentFeedback
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    const { surveyId, userId, to, cc, bcc } = this.params;
    const subject = 'Intake24: My dietary feedback';
    const filename = `Intake24-MyFeedback-${new Date().toISOString().substring(0, 10)}.pdf`;
    const { path, url } = await this.feedbackService.getFeedbackFile(surveyId, userId);
    const html = nunjucks.render('mail/feedback.html', {
      title: subject,
      action: { url, text: 'Download feedback' },
    });

    await this.mailer.sendMail({
      to,
      cc,
      bcc,
      subject,
      html,
      attachments: [
        { contentDisposition: 'attachment', contentType: 'application/pdf', path, filename },
      ],
    });

    await fs.remove(path);

    this.logger.debug('Job finished.');
  }
}
