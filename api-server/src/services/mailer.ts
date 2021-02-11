import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import type { IoC } from '@/ioc';

export default class Mailer {
  private readonly config;

  private readonly logger;

  private transporter!: Transporter;

  constructor({ config, logger }: Pick<IoC, 'config' | 'logger'>) {
    this.config = config;
    this.logger = logger;
  }

  init(): void {
    const { mailer } = this.config.mail;
    let options = {};

    const isDev = this.config.app.env === 'development';

    switch (mailer) {
      case 'smtp':
        options = {
          ...this.config.mail.mailers[mailer],
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
      const { from } = this.config.mail;
      const defaults: SendMailOptions = { from };

      const info = await this.transporter.sendMail({ ...defaults, ...options });

      this.logger.info(info.messageId);

      // TODO: pipe it to winston logger
      if (this.config.mail.mailer === 'log') info.message.pipe(process.stdout);
    } catch (err) {
      const { message, name, stack } = err;
      this.logger.error(stack ?? `${name}: ${message}`);
    }
  }
}
