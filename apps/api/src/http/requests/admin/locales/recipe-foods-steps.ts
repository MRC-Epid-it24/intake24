import { body } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

export default validate(
  body()
    .custom((value: any[]) => {
      if (
        value.some(
          ({
            id,
            recipeFoodsId,
            code,
            localeId,
            name,
            description,
            order,
            categoryCode,
            repeatable,
          }) =>
            (typeof id !== 'undefined' && typeof id !== 'string') ||
            (typeof recipeFoodsId !== 'number' && typeof recipeFoodsId !== 'string') ||
            typeof code !== 'string' ||
            typeof localeId !== 'string' ||
            (typeof order !== 'string' && typeof order !== 'number') ||
            (typeof name !== 'object' && typeof name !== 'string') ||
            (typeof description !== 'object' && typeof description !== 'string') ||
            typeof categoryCode !== 'string' ||
            typeof repeatable !== 'boolean'
        )
      )
        return false;

      return true;
    })
    .withMessage('Invalid Recipe Food Steps object')
);
