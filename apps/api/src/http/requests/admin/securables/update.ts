import { checkSchema } from 'express-validator';

import type { ValidationMiddleware } from '@intake24/api/http/requests/util';
import type { SecurableType } from '@intake24/common/security';
import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import defaults from './defaults';

export default (securable: SecurableType): ValidationMiddleware[] =>
  validate(
    checkSchema({
      userId: {
        in: ['params'],
        errorMessage: typeErrorMessage('int._'),
        isInt: true,
      },
      ...defaults(securable),
    })
  );
