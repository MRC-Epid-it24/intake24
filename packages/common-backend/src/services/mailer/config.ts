export type MailerType = 'smtp' | 'log';

export type BaseMailer = {
  transport: string;
};

export type LogMailer = BaseMailer;

export interface SMTPMailer extends BaseMailer {
  host: string;
  port: number;
  secure: boolean;
  ignoreTLS: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

export type MailConfig = {
  mailer: MailerType;
  mailers: {
    smtp: SMTPMailer;
    log: LogMailer;
  };
  from: {
    address: string;
    name: string;
  };
  replyTo?: string;
};

const user = process.env.MAIL_USERNAME || null;
const pass = process.env.MAIL_PASSWORD || null;
const auth = user && pass ? { user, pass } : undefined;

export const mailConfig: MailConfig = {
  mailer: (process.env.MAIL_MAILER as MailerType) || 'log',

  mailers: {
    smtp: {
      transport: 'smtp',
      host: process.env.MAIL_HOST || 'localhost',
      port: parseInt(process.env.MAIL_PORT || '25', 10),
      secure: process.env.MAIL_SECURE === 'true',
      ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
      auth,
    },
    log: {
      transport: 'log',
    },
  },

  from: {
    address: process.env.MAIL_FROM_ADDRESS || 'no-reply@domain.com',
    name: process.env.MAIL_FROM_NAME || 'Intake24',
  },

  replyTo: process.env.MAIL_REPLY_TO_ADDRESS,
};

export default mailConfig;
