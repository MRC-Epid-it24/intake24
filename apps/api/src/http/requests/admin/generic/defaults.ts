import type { Schema } from 'express-validator';

import { typeErrorMessage } from '@intake24/api/http/requests/util';

export const paginate: Schema = {
  page: {
    in: ['query'],
    errorMessage: typeErrorMessage('int.min', { min: 1 }),
    isInt: {
      options: {
        min: 1,
      },
    },
    toInt: true,
    optional: true,
  },
  limit: {
    in: ['query'],
    errorMessage: typeErrorMessage('int.minMax', { min: 1, max: 1000 }),
    isInt: { options: { min: 1, max: 1000 } },
    toInt: true,
    optional: true,
  },
  sort: {
    in: ['query'],
    errorMessage: typeErrorMessage('regEx._'),
    isString: true,
    optional: true,
    matches: { options: /^\w+\|(asc|desc)$/ },
  },
  search: {
    in: ['query'],
    errorMessage: typeErrorMessage('string.max', { max: 128 }),
    isString: true,
    isLength: { bail: true, options: { max: 128 } },
    optional: { options: { nullable: true } },
  },
};
