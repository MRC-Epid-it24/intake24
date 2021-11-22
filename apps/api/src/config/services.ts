export type ReCaptcha = {
  enabled: boolean;
  secret: string;
};

export type WebPush = {
  subject: string;
  publicKey: string;
  privateKey: string;
};

export type ServicesConfig = {
  reCaptcha: ReCaptcha;
  webPush: WebPush;
};

const servicesConfig: ServicesConfig = {
  reCaptcha: {
    enabled: process.env.RECAPTCHA_ENABLED === 'true',
    secret: process.env.RECAPTCHA_SECRET ?? '',
  },
  webPush: {
    subject: process.env.WEBPUSH_SUBJECT ?? '',
    publicKey: process.env.WEBPUSH_PUBLIC_KEY ?? '',
    privateKey: process.env.WEBPUSH_PRIVATE_KEY ?? '',
  },
};

export default servicesConfig;
