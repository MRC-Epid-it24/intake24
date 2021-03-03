import { checkSchema } from 'express-validator';
import { has, isPlainObject } from 'lodash';
import validate from '@/http/requests/validate';

export default validate(
  checkSchema({
    // TODO: use some JSON Schema Validator for questions/meals/export, like ajv
    subscription: {
      in: ['body'],
      errorMessage: 'Invalid subscription object.',
      custom: {
        options: async (value): Promise<void> => {
          if (
            !isPlainObject(value) ||
            !has(value, 'endpoint') ||
            !has(value, 'keys.p256dh') ||
            !has(value, 'keys.auth')
          )
            throw new Error('Invalid subscription object.');

          Promise.resolve();
        },
      },
    },
  })
);
