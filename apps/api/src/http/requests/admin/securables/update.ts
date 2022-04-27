import { checkSchema } from 'express-validator';
import validate, { ValidationMiddleware } from '@intake24/api/http/requests/validate';
import type { SecurableType } from '@intake24/common/security';
import defaults from './defaults';

export default (securable: SecurableType): ValidationMiddleware[] =>
  validate(
    checkSchema({
      userId: {
        in: ['params'],
        errorMessage: 'Please select an user.',
        isInt: true,
      },
      ...defaults(securable),
    })
  );
