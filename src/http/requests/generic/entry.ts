import { checkSchema } from 'express-validator';
import validate from '@/http/requests/validate';

export default validate(
  checkSchema({
    id: {
      in: ['params'],
      errorMessage: 'Invalid :id URL parameter.',
      isInt: true,
      toInt: true,
    },
  })
);
