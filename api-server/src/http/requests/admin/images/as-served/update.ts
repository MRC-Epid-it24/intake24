import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    images: {
      in: ['body'],
      custom: {
        options: async (value): Promise<void> => {
          if (
            !Array.isArray(value) ||
            value.some(({ id, weight }) => typeof id !== 'number' || typeof weight !== 'number')
          )
            throw new Error('Please enter a list of as served image IDs and weights.');
        },
      },
    },
  })
);
