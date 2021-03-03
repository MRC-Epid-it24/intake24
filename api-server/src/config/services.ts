export type ServicesConfig = {
  reCaptcha: {
    enabled: boolean;
    secret: string;
  };
  webPush: {
    subject: string;
    publicKey: string;
    privateKey: string;
  };
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
