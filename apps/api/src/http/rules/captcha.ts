import { URLSearchParams } from 'node:url';

import axios from 'axios';

import type { Captcha } from '@intake24/api/config';
import type { CaptchaProvider } from '@intake24/common/types';

export type CaptchaResponse = {
  success: boolean;
  // eslint-disable-next-line camelcase
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
  score?: number;
  action?: string;
};

export type CaptchaCallback = (secret: string, response: string) => Promise<void>;

const hCaptcha: CaptchaCallback = async (secret: string, response: string) => {
  try {
    const { data: { success } = {} } = await axios.post<CaptchaResponse>(
      'https://hcaptcha.com/siteverify',
      new URLSearchParams({ secret, response }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    if (!success) throw new Error();

    Promise.resolve();
  } catch (err) {
    throw new Error('Invalid hCaptcha challenge.');
  }
};

const reCaptcha: CaptchaCallback = async (secret: string, response: string) => {
  try {
    const { data: { success } = {} } = await axios.post<CaptchaResponse>(
      'https://www.google.com/recaptcha/api/siteverify',
      new URLSearchParams({ secret, response }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    if (!success) throw new Error();

    Promise.resolve();
  } catch (err) {
    throw new Error('Invalid reCAPTCHA challenge.');
  }
};

const captchaProviders: Record<CaptchaProvider, CaptchaCallback> = {
  'h-captcha': hCaptcha,
  're-captcha': reCaptcha,
};

export default async (response: any, options: Captcha): Promise<void> => {
  const { provider, secret } = options;
  if (!provider) {
    Promise.resolve();
    return;
  }

  if (typeof response !== 'string' || !response)
    throw new Error('Missing reCAPTCHA challenge response token.');

  await captchaProviders[provider](secret, response);
};
