import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';
import { validateGuideImageObjects } from '@common/validators';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    objects: {
      in: ['body'],
      errorMessage: 'Guide image objects are invalid.',
      custom: {
        options: (value): boolean => {
          try {
            validateGuideImageObjects(value);
            return true;
          } catch (err) {
            throw new Error(err.message.split('\n')[0]);
          }
        },
      },
    },
  })
);
