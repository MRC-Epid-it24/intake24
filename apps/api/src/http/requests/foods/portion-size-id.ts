import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    id: {
      in: ['query'],
      errorMessage: 'Missing ID query parameter.',
      isEmpty: { negated: true },
      custom: {
        options: (value): boolean => {
          if (
            typeof value === 'string' ||
            (Array.isArray(value) && value.every((item) => typeof item === 'string'))
          )
            return true;

          throw new Error('Invalid ID query parameter.');
        },
      },
    },
  })
);
