import { checkSchema } from 'express-validator';
import { validateGuideImageObjects } from '@intake24/common/validators';
import validate from '@intake24/api/http/requests/validate';
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
          } catch (err: any) {
            throw new Error(err.message.split('\n')[0]);
          }
        },
      },
    },
  })
);
