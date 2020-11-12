import nunjucks from 'nunjucks';
import config from '@/config';
import logger from '@/services/logger';
import mailer from '@/services/mailer';
import type { JobData } from '@/services/queues/jobs-queue-handler';
import { Job, JobType } from './job';

export interface SendPasswordResetData {
  email: string;
  token: string;
}

export default class SendPasswordReset implements Job {
  public readonly name: JobType = 'SendPasswordReset';

  data: SendPasswordResetData;

  constructor({ data }: JobData<SendPasswordResetData>) {
    this.data = data;
  }

  /**
   * Run the job
   *
   * @return Promise<void>
   */
  public async run(): Promise<void> {
    logger.debug(`Job ${this.name} started.`);

    const url = `${config.app.urls.admin}/password/reset/${this.data.token}`;
    const { expire: expiresAt } = config.security.passwords;

    const html = nunjucks.render('mail/password-reset.html', {
      title: 'Password reset',
      expiresAt,
      action: { url, text: 'Reset password' },
    });

    await mailer.sendMail({ to: this.data.email, subject: 'Password reset', html });

    logger.debug(`Job ${this.name} finished.`);
  }
}
