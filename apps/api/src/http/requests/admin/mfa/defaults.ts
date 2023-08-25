import type { ParamSchema } from 'express-validator';

import { typeErrorMessage } from '@intake24/api/http/requests/util';
import { mfaProviders } from '@intake24/common/security';

export const name: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string.max', { max: 128 }),
  isString: true,
  isEmpty: { negated: true },
  isLength: { options: { max: 128 } },
};

export const challengeId: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string._'),
  isString: true,
  isEmpty: { negated: true },
};

export const provider: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string._'),
  isString: true,
  isEmpty: { negated: true },
  isIn: {
    options: [mfaProviders],
    errorMessage: typeErrorMessage('in.options', { options: mfaProviders }),
  },
};

export const token: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string._'),
  isString: true,
  isEmpty: { negated: true },
};

export const otpToken: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string.minMax', { min: 6, max: 6 }),
  isString: true,
  isEmpty: { negated: true },
  isLength: { options: { min: 6, max: 6 } },
};
