import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { validateImageMapObjects } from '@common/validators';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    objects: {
      in: ['body'],
      errorMessage: 'Image map objects are invalid.',
      custom: {
        options: (value): boolean => {
          try {
            validateImageMapObjects(value);
            return true;
          } catch (err) {
            throw new Error(err.message.split('\n')[0]);
          }
        },
      },
    },
  })
);
