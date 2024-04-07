import { body } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

export default validate(
  body()
    .custom((value: any[]) => {
      if (
        value.some(
          ({ id, code, localeId, name, recipeWord, _synonyms_id }) =>
            (typeof id !== 'undefined' && typeof id !== 'string')
            || (typeof code !== 'string' && code[0] !== '$')
            || typeof localeId !== 'string'
            || typeof name !== 'string'
            || typeof name !== 'string'
            || typeof recipeWord !== 'string',
        )
      )
        return false;

      return true;
    })
    .withMessage('Invalid Recipe Foods object'),
);
