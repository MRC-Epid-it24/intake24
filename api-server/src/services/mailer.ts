import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import appConfig from '@/config/app';
import config, { MailerType } from '@/config/mail';
import logger from '@/services/logger';

class Mailer {
  mailer!: MailerType;

  transporter!: Transporter;

  init(): void {
    const { mailer } = config;
    this.mailer = mailer;

    let options = {};

    const isDev = appConfig.env === 'development';

    switch (mailer) {
      case 'smtp':
        options = {
          ...config.mailers[mailer],
          pool: true,
          debug: isDev,
          logger: isDev,
        };
        break;
      case 'log':
      default:
        options = { streamTransport: true };
        break;
    }

    this.transporter = nodemailer.createTransport(options);
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    try {
      const { from } = config;
      const defaults: SendMailOptions = { from };

      const info = await this.transporter.sendMail({ ...defaults, ...options });

      logger.info(info.messageId);

      // TODO: pipe it to winston logger
      if (this.mailer === 'log') info.message.pipe(process.stdout);
    } catch (err) {
      const { message, name, stack } = err;
      logger.error(stack ?? `${name}: ${message}`);
    }
  }
}

export default new Mailer();
