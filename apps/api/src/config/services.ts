import type { CaptchaProvider } from '@intake24/common/types';
import { isCaptchaProvider } from '@intake24/common/types';

export type Captcha = {
  provider: CaptchaProvider | null;
  secret: string;
};

export type WebPush = {
  subject: string;
  publicKey: string;
  privateKey: string;
};

export type ServicesConfig = {
  captcha: Captcha;
  webPush: WebPush;
};

const provider = process.env.CAPTCHA_PROVIDER;
if (provider && !isCaptchaProvider(provider)) throw new Error('Invalid Captcha provider');

const servicesConfig: ServicesConfig = {
  captcha: {
    provider: isCaptchaProvider(provider) ? provider : null,
    secret: process.env.CAPTCHA_SECRET ?? '',
  },
  webPush: {
    subject: process.env.WEBPUSH_SUBJECT ?? '',
    publicKey: process.env.WEBPUSH_PUBLIC_KEY ?? '',
    privateKey: process.env.WEBPUSH_PRIVATE_KEY ?? '',
  },
};

export default servicesConfig;
