import { checkSchema } from 'express-validator';

import { localeIdValidator, validate } from '@intake24/api/http/requests/util';
import { searchSortingAlgorithms } from '@intake24/common/types/models';

export default validate(
  checkSchema({
    localeId: {
      in: ['params'],
      notEmpty: true,
      custom: {
        options: localeIdValidator,
      },
    },
    description: {
      in: ['query'],
      notEmpty: true,
      isLength: {
        options: {
          max: 120,
        },
        errorMessage: 'Description cannot be longer than 120 characters',
      },
      errorMessage: 'Description cannot be empty',
    },
    previous: {
      in: ['query'],
      isArray: true,
      optional: true,
    },
    limit: {
      in: ['query'],
      isInt: true,
      optional: true,
    },
    rankingAlgorithm: {
      in: ['query'],
      optional: true,
      isIn: {
        options: [searchSortingAlgorithms],
      },
      errorMessage: 'Invalid sorting algorithm',
    },
    matchScoreWeight: {
      in: ['query'],
      optional: true,
      isFloat: {
        errorMessage: 'Value must be a number',
      },
      custom: {
        options: (value: number) => {
          if (value >= 0 && value <= 100) return Promise.resolve();
          else return Promise.reject('Value must be in the range [0, 100]');
        },
      },
    },
  })
);
