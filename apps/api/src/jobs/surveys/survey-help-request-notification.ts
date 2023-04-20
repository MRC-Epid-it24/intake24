import type { Job } from 'bullmq';
import nunjucks from 'nunjucks';

import type { IoC } from '@intake24/api/ioc';
import { UserSurveyAlias } from '@intake24/db';

import BaseJob from '../job';

export default class SurveyHelpRequestNotification extends BaseJob<'SurveyHelpRequestNotification'> {
  readonly name = 'SurveyHelpRequestNotification';

  private readonly adminUserService;

  private readonly mailer;

  constructor({
    adminUserService,
    logger,
    mailer,
  }: Pick<IoC, 'adminUserService' | 'logger' | 'mailer'>) {
    super({ logger });

    this.adminUserService = adminUserService;
    this.mailer = mailer;
  }

  /**
   * Run the task
   *
   * @param {Job} job
   * @returns {Promise<void>}
   * @memberof SurveyHelpRequestNotification
   */
  public async run(job: Job): Promise<void> {
    this.init(job);

    this.logger.debug('Job started.');

    const info = await this.getSurveyUserInfo();
    if (!info) return;

    const { survey, alias } = info;

    let users = await this.adminUserService.getSurveySupportUsers(survey.id);

    if (!users.length) users = await this.adminUserService.getGlobalSupportUsers();

    const to = users.map(({ email }) => email).filter(Boolean) as string[];

    if (!to.length) {
      this.logger.warn(`SurveyHelpRequestNotification: no survey or global support users found.`);
      return;
    }

    await this.sendEmail(survey.name, alias.username, to);

    this.logger.debug('Job finished.');
  }

  private async getSurveyUserInfo() {
    const { userId, surveySlug } = this.params;

    const alias = await UserSurveyAlias.findOne({
      where: { userId },
      include: [{ association: 'survey', where: { slug: surveySlug }, required: true }],
    });

    if (!alias || !alias.survey) {
      this.logger.warn(
        `SurveyHelpRequestNotification: could not find user alias for survey: ${surveySlug}, userId: ${userId}`
      );

      return null;
    }

    const { survey } = alias;

    return { alias, survey };
  }

  private async sendEmail(surveyName: string, username: string, to: string[]) {
    const { name, email, phone } = this.params;
    const subject = `🍔 Intake24: Help request (${surveyName})`;

    const html = nunjucks.render('mail/surveys/help-request.njk', {
      title: subject,
      surveyName,
      username,
      name,
      email,
      phone,
    });
    await this.mailer.sendMail({ to, subject, html });
  }
}
