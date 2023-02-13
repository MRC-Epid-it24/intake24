import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import { userAgent } from '../../generic';
import { challengeId, provider } from '../mfa/defaults';

export default validate(
  checkSchema({
    'user-agent': userAgent,
    challengeId,
    provider,
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
    'response.response.authenticatorData': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    'response.response.signature': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isEmpty: { negated: true },
    },
    'response.response.userHandle': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      optional: true,
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
