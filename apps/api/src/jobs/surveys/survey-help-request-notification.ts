import type { Job } from 'bullmq';
import nunjucks from 'nunjucks';

import type { IoC } from '@intake24/api/ioc';
import type { Survey } from '@intake24/db';
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

    const to = await this.resolveRecipients(survey);

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

  private async resolveRecipients(survey: Survey) {
    let to: string[] = [];

    /* 1. Get survey support users */
    const surveyUsers = await this.adminUserService.getSurveySupportUsers(survey.id);
    if (surveyUsers.length) to = surveyUsers.map(({ email }) => email).filter(Boolean) as string[];

    /* 2. If no survey support users found, use survey support email */
    if (!to.length) to = [survey.supportEmail].filter(Boolean);

    /* 3. If no survey support email found, get global support users */
    if (!to.length) {
      const globalUsers = await this.adminUserService.getGlobalSupportUsers();
      if (globalUsers.length)
        to = globalUsers.map(({ email }) => email).filter(Boolean) as string[];
    }

    return to;
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
