import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    params: {
      in: ['query'],
      isJWT: true,
    },
  })
);
