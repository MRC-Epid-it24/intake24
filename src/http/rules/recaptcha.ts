import axios from 'axios';
import config from '@/config/security';

export type RecaptchaResponse = {
  success: boolean;
  // eslint-disable-next-line camelcase
  challenge_ts: string;
  hostname: string;
  'error-codes': string[];
  score?: number;
  action?: string;
};

export default async (token?: string | null): Promise<void> => {
  const { enabled, secret } = config.recaptcha;
  if (!enabled) return Promise.resolve();

  if (typeof token !== 'string' || !token)
    return Promise.reject(new Error('Invalid reCAPTCHA challenge.'));

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;

  try {
    const { data: { success } = {} } = await axios.post<RecaptchaResponse>(url);
    return success ? Promise.resolve() : Promise.reject(new Error('Invalid reCAPTCHA challenge.'));
  } catch (err) {
    return Promise.reject(new Error('Invalid reCAPTCHA challenge.'));
  }
};
