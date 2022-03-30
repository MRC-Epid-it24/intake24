import type { Job } from 'bullmq';
import { trim } from 'lodash';
import nunjucks from 'nunjucks';
import type { SendPasswordResetParams } from '@intake24/common/types';
import type { IoC } from '@intake24/api/ioc';
import { isUrlAbsolute } from '@intake24/api/util';
import BaseJob from './job';

export default class SendPasswordReset extends BaseJob<SendPasswordResetParams> {
  readonly name = 'SendPasswordReset';

  private readonly appConfig;

  private readonly securityConfig;

  private readonly mailer;

  constructor({
    appConfig,
    securityConfig,
    logger,
    mailer,
  }: Pick<IoC, 'appConfig' | 'securityConfig' | 'logger' | 'mailer'>) {
    super({ logger });

    this.appConfig = appConfig;
    this.securityConfig = securityConfig;
    this.mailer = mailer;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SendPasswordReset
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    const { base, admin } = this.appConfig.urls;
    const domain = isUrlAbsolute(admin)
      ? trim(admin, '/')
      : `${trim(base, '/')}/${trim(admin, '/')}`;

    const url = `${domain}/password/reset/${this.params.token}`;
    const { expiresIn } = this.securityConfig.passwords;

    const html = nunjucks.render('mail/password-reset.html', {
      title: 'Password reset',
      expiresIn,
      action: { url, text: 'Reset password' },
    });

    await this.mailer.sendMail({ to: this.params.email, subject: 'Password reset', html });

    this.logger.debug('Job finished.');
  }
}
