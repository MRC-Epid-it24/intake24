import type { Schema } from 'express-validator';

export const paginate: Schema = {
  page: {
    in: ['query'],
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
    isInt: {
      options: {
        min: 1,
        max: 1000,
      },
    },
    toInt: true,
    optional: true,
  },
  sort: {
    in: ['query'],
    isString: true,
    optional: true,
    matches: { options: /^\w+\|(asc|desc)$/ },
  },
  search: {
    in: ['query'],
    isString: true,
    optional: true,
  },
};
