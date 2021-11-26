import { checkSchema } from 'express-validator';
import validate from '@api/http/requests/validate';

export default validate(
  checkSchema({
    params: {
      in: ['query'],
      isJWT: true,
    },
  })
);
