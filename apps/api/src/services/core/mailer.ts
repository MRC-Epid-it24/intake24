import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import type { IoC } from '@intake24/api/ioc';

export default class Mailer {
  private readonly environment;

  private readonly mailConfig;

  private readonly logger;

  private transporter!: Transporter;

  constructor({
    environment,
    mailConfig,
    logger,
  }: Pick<IoC, 'environment' | 'mailConfig' | 'logger'>) {
    this.environment = environment;
    this.mailConfig = mailConfig;
    this.logger = logger.child({ service: 'Mailer' });
  }

  init(): void {
    const { mailer } = this.mailConfig;
    let options = {};

    const isDev = this.environment === 'development';

    switch (mailer) {
      case 'smtp':
        options = {
          ...this.mailConfig.mailers[mailer],
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
      const { from } = this.mailConfig;
      const defaults: SendMailOptions = { from };

      const info = await this.transporter.sendMail({ ...defaults, ...options });

      this.logger.info(info.messageId);

      // TODO: pipe it to winston logger
      if (this.mailConfig.mailer === 'log') info.message.pipe(process.stdout);
    } catch (err) {
      if (err instanceof Error) {
        const { message, name, stack } = err;
        this.logger.error(stack ?? `${name}: ${message}`);
        return;
      }

      this.logger.error(err);
    }
  }
}
