import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    token: {
      errorMessage: typeErrorMessage('jwt._'),
      isJWT: true,
    },
  })
);
