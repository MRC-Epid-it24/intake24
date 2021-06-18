import { trim } from 'lodash';
import nunjucks from 'nunjucks';
import type { IoC } from '@/ioc';
import { isUrlAbsolute } from '@/util';
import type { Job, JobData, JobType } from '.';

export interface SendPasswordResetData {
  email: string;
  token: string;
}

export default class SendPasswordReset implements Job {
  public readonly name: JobType = 'SendPasswordReset';

  private data!: SendPasswordResetData;

  private readonly appConfig;

  private readonly securityConfig;

  private readonly logger;

  private readonly mailer;

  constructor({
    appConfig,
    securityConfig,
    logger,
    mailer,
  }: Pick<IoC, 'appConfig' | 'securityConfig' | 'logger' | 'mailer'>) {
    this.appConfig = appConfig;
    this.securityConfig = securityConfig;
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

    const { base, admin } = this.appConfig.urls;
    const domain = isUrlAbsolute(admin)
      ? trim(admin, '/')
      : `${trim(base, '/')}/${trim(admin, '/')}`;

    const url = `${domain}/password/reset/${this.data.token}`;
    const { expire: expiresAt } = this.securityConfig.passwords;

    const html = nunjucks.render('mail/password-reset.html', {
      title: 'Password reset',
      expiresAt,
      action: { url, text: 'Reset password' },
    });

    await this.mailer.sendMail({ to: this.data.email, subject: 'Password reset', html });

    this.logger.debug(`Job ${this.name} finished.`);
  }
}
