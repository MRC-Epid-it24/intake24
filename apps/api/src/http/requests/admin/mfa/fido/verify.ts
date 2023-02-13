import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';

import { challengeId, name } from '../defaults';

export default validate(
  checkSchema({
    challengeId,
    name,
    'response.id': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    'response.rawId': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    'response.response.clientDataJSON': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    'response.response.attestationObject': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    'response.response.transports': {
      in: ['body'],
      errorMessage: typeErrorMessage('array._'),
      isArray: { bail: true },
      custom: {
        options: async (value: any[], meta): Promise<void> => {
          if (value.some((item) => typeof item !== 'string'))
            throw new Error(customTypeErrorMessage('array.string', meta));
        },
      },
    },
    'response.authenticatorAttachment': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      optional: true,
    },
    'response.clientExtensionResults.appid': {
      errorMessage: typeErrorMessage('boolean._'),
      isBoolean: { options: { strict: true } },
      optional: true,
    },
    'response.clientExtensionResults.credProps.rk': {
      errorMessage: typeErrorMessage('boolean._'),
      isBoolean: { options: { strict: true } },
      optional: true,
    },
    'response.clientExtensionResults.hmacCreateSecret': {
      errorMessage: typeErrorMessage('boolean._'),
      isBoolean: { options: { strict: true } },
      optional: true,
    },
    'response.type': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
  })
);
