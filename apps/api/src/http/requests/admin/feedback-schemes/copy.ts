import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { FeedbackScheme } from '@intake24/db';

export default validate(
  checkSchema({
    name: {
      in: ['body'],
      errorMessage: 'Feedback scheme name must be unique.',
      isString: { bail: true },
      isEmpty: { negated: true, bail: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: FeedbackScheme, condition: { field: 'name', value } }),
      },
    },
  })
);
