import type { Job } from 'bullmq';
import ms from 'ms';
import nunjucks from 'nunjucks';
import { Op } from 'sequelize';
import parser from 'ua-parser-js';

import type { IoC } from '@intake24/api/ioc';
import { getFrontEndUrl } from '@intake24/api/util';
import { randomString } from '@intake24/common/util';
import { User, UserPasswordReset } from '@intake24/db';

import BaseJob from '../job';

const getAgentInfo = (agent: { name?: string; version?: string }): string | undefined => {
  return agent.name && agent.version ? `${agent.name} (${agent.version})` : undefined;
};

export default class SendPasswordReset extends BaseJob<'SendPasswordReset'> {
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

    const { email } = this.params;

    const user = await this.getUser();

    if (!user) {
      this.logger.warn(`Password reset: email address (${email}) not found in database.`);
      return;
    }

    await this.sendEmail(user);

    this.logger.debug('Job finished.');
  }

  private async getUser(): Promise<User | null> {
    const { email } = this.params;
    const op = User.sequelize?.getDialect() === 'postgres' ? Op.iLike : Op.eq;

    return User.findOne({ where: { email: { [op]: email } } });
  }

  private async sendEmail(user: User) {
    const { email, userAgent } = this.params;
    const { id: userId, name } = user;

    const { browser, os } = parser(userAgent);
    const uaInfo = [browser, os].map(getAgentInfo).filter(Boolean).join(', ');

    const token = randomString(128);
    const { base, admin } = this.appConfig.urls;
    const domain = getFrontEndUrl(base, admin);

    const url = `${domain}/password/reset/${token}`;
    const { expiresIn } = this.securityConfig.passwords;

    await UserPasswordReset.create({ userId, token });

    const html = nunjucks.render('mail/password-reset.njk', {
      email,
      name: name ?? '',
      uaInfo,
      expiresIn: ms(expiresIn, { long: true }),
      action: { url, text: 'Reset password' },
    });

    await this.mailer.sendMail({ to: email, subject: 'Intake24 password reset request', html });
  }
}
