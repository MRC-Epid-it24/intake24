import { trim } from 'lodash';
import nunjucks from 'nunjucks';
import type { IoC } from '@/ioc';
import { isUrlAbsolute } from '@/util';
import { SendPasswordResetParams } from '@common/types';
import { JobsOptions } from 'bullmq';
import Job from './job';

export default class SendPasswordReset extends Job<SendPasswordResetParams> {
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
   * @param {string} jobId
   * @param {SendPasswordResetParams} params
   * @param {JobsOptions} ops
   * @returns {Promise<void>}
   * @memberof SendPasswordReset
   */
  public async run(
    jobId: string,
    params: SendPasswordResetParams,
    ops: JobsOptions
  ): Promise<void> {
    this.init(jobId, params, ops);

    this.logger.debug(`Job ${this.name} | ${jobId} started.`);

    const { base, admin } = this.appConfig.urls;
    const domain = isUrlAbsolute(admin)
      ? trim(admin, '/')
      : `${trim(base, '/')}/${trim(admin, '/')}`;

    const url = `${domain}/password/reset/${this.params.token}`;
    const { expire: expiresAt } = this.securityConfig.passwords;

    const html = nunjucks.render('mail/password-reset.html', {
      title: 'Password reset',
      expiresAt,
      action: { url, text: 'Reset password' },
    });

    await this.mailer.sendMail({ to: this.params.email, subject: 'Password reset', html });

    this.logger.debug(`Job ${this.name} | ${jobId} finished.`);
  }
}
