/* eslint-disable import/prefer-default-export */
import { Schema } from 'express-validator';

export const paginate: Schema = {
  page: {
    in: ['query'],
    isInt: true,
    toInt: true,
    optional: { options: { nullable: true } },
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
    optional: { options: { nullable: true } },
  },
  sort: {
    in: ['query'],
    isString: true,
    optional: { options: { nullable: true } },
    matches: { options: /^\w+\|(asc|desc)$/ },
    escape: true,
  },
  search: {
    in: ['query'],
    isString: true,
    optional: { options: { nullable: true } },
    escape: true,
  },
};
