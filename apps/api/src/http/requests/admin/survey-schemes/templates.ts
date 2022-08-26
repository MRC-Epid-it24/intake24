import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    search: {
      in: ['query'],
      isString: true,
      optional: { options: { nullable: true } },
    },
    limit: {
      in: ['query'],
      isInt: { options: { min: 1, max: 100 } },
      toInt: true,
      optional: { options: { nullable: true } },
    },
  })
);
