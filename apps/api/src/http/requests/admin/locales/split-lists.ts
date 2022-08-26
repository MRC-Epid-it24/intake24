import { body } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

export default validate(
  body()
    .isArray()
    .withMessage('Value has to be an array')
    .bail()
    .custom((value: any[]) => {
      if (
        value.some(
          ({ id, firstWord, words }) =>
            (typeof id !== 'undefined' && typeof id !== 'string') ||
            typeof firstWord !== 'string' ||
            typeof words !== 'string'
        )
      )
        return false;

      return true;
    })
    .withMessage('Invalid split lists')
);
