import { body } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

export default validate(
  body()
    .custom((value: any[]) => {
      if (
        value.some(
          ({ id, code, localeId, name, specialWords, synonyms }) =>
            (typeof id !== 'undefined' && typeof id !== 'string') ||
            typeof code !== 'string' ||
            typeof localeId !== 'string' ||
            typeof name !== 'string' ||
            typeof specialWords !== 'string' ||
            typeof synonyms !== 'string' ||
            typeof name !== 'string' ||
            typeof specialWords !== 'string'
        )
      )
        return false;

      return true;
    })
    .withMessage('Invalid Special Foods object')
);
