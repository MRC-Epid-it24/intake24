import { checkSchema } from 'express-validator';
import { validateImageMapObjects } from '@common/validators';
import validate from '@/http/requests/validate';
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
          } catch (err: any) {
            throw new Error(err.message.split('\n')[0]);
          }
        },
      },
    },
  })
);
