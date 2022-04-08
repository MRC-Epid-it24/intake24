import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import defaults from './defaults';

export default validate(
  checkSchema({
    userId: {
      in: ['params'],
      errorMessage: 'Please select an user.',
      isInt: true,
    },
    ...defaults,
  })
);
