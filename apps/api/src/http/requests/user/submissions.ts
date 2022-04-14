import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    survey: {
      in: ['query'],
      errorMessage: 'Survey must be string or array of strings.',
      custom: {
        options: async (value): Promise<void> => {
          if (typeof value !== 'string' && !Array.isArray(value))
            throw new Error('Survey must be string or array of strings.');

          if (Array.isArray(value) && value.some((item) => typeof item !== 'string'))
            throw new Error('Survey must be string or array of strings.');
        },
      },
    },
  })
);
