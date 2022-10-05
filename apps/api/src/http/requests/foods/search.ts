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
      },
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
      isIn: {
        options: [searchSortingAlgorithms],
      },
      errorMessage: 'Invalid sorting algorithm',
    },
    matchScoreWeight: {
      in: ['query'],
      optional: true,
      isNumeric: {
        if: (v: number) => v >= 0 && v <= 1,
      },
    },
  })
);
