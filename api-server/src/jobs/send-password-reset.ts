import nunjucks from 'nunjucks';
import type { IoC } from '@/ioc';
import { Job, JobData, JobType } from './job';

export interface SendPasswordResetData {
  email: string;
  token: string;
}

export default class SendPasswordReset implements Job {
  public readonly name: JobType = 'SendPasswordReset';

  private data!: SendPasswordResetData;

  private readonly config;

  private readonly logger;

  private readonly mailer;

  constructor({ config, logger, mailer }: IoC) {
    this.config = config;
    this.logger = logger;
    this.mailer = mailer;
  }

  /**
   * Run the job
   *
   * @return Promise<void>
   */
  public async run({ data }: JobData<SendPasswordResetData>): Promise<void> {
    this.data = data;

    this.logger.debug(`Job ${this.name} started.`);

    const url = `${this.config.app.urls.admin}/password/reset/${this.data.token}`;
    const { expire: expiresAt } = this.config.security.passwords;

    const html = nunjucks.render('mail/password-reset.html', {
      title: 'Password reset',
      expiresAt,
      action: { url, text: 'Reset password' },
    });

    await this.mailer.sendMail({ to: this.data.email, subject: 'Password reset', html });

    this.logger.debug(`Job ${this.name} finished.`);
  }
}
