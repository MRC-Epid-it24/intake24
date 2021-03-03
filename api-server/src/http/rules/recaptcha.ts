import axios from 'axios';
import config from '@/config/services';

export type ReCaptchaResponse = {
  success: boolean;
  // eslint-disable-next-line camelcase
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
  score?: number;
  action?: string;
};

export default async (token?: string | null): Promise<void> => {
  const { enabled, secret } = config.reCaptcha;
  if (!enabled) return Promise.resolve();

  if (typeof token !== 'string' || !token) throw new Error('Invalid reCAPTCHA challenge.');

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

  try {
    const { data: { success } = {} } = await axios.post<ReCaptchaResponse>(url);
    if (!success) throw new Error('Invalid reCAPTCHA challenge.');
    return Promise.resolve();
  } catch (err) {
    throw new Error('Invalid reCAPTCHA challenge.');
  }
};
