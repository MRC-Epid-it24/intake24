import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

import { paginate } from '../generic/defaults';

export default validate(
  checkSchema({
    ...paginate,
    nutrientTableId: {
      in: ['query'],
      isString: true,
      optional: true,
      escape: true,
    },
  })
);
