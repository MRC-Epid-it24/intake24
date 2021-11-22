import axios from 'axios';
import { ReCaptcha } from '@api/config';

export type ReCaptchaResponse = {
  success: boolean;
  // eslint-disable-next-line camelcase
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
  score?: number;
  action?: string;
};

export default async (token: any, options: ReCaptcha): Promise<void> => {
  const { enabled, secret } = options;
  if (!enabled) {
    Promise.resolve();
    return;
  }

  if (typeof token !== 'string' || !token) throw new Error('Invalid reCAPTCHA challenge.');

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

  try {
    const { data: { success } = {} } = await axios.post<ReCaptchaResponse>(url);
    if (!success) throw new Error('Invalid reCAPTCHA challenge.');
    Promise.resolve();
  } catch (err) {
    throw new Error('Invalid reCAPTCHA challenge.');
  }
};
