import path from 'node:path';

import type { Meta } from 'express-validator';
import { endOfDay, startOfDay } from 'date-fns';
import { checkSchema } from 'express-validator';
import { isPlainObject } from 'lodash';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { jobRequiresFile, pickJobParams, surveyJobs } from '@intake24/common/types';

export default validate(
  checkSchema({
    type: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isIn: {
        options: [surveyJobs],
        errorMessage: typeErrorMessage('in.options', { options: surveyJobs }),
      },
    },
    params: {
      in: ['body'],
      customSanitizer: {
        options: (value, { req }) =>
          isPlainObject(value) && req.body.type && surveyJobs.includes(req.body.type)
            ? pickJobParams(value, req.body.type)
            : {},
      },
    },
    'params.startDate': {
      in: ['body'],
      errorMessage: typeErrorMessage('date._'),
      isDate: true,
      optional: true,
      customSanitizer: { options: value => startOfDay(new Date(value)) },
    },
    'params.endDate': {
      in: ['body'],
      errorMessage: typeErrorMessage('date._'),
      isDate: true,
      optional: true,
      customSanitizer: { options: value => endOfDay(new Date(value)) },
    },
    'params.file': {
      in: ['body'],
      custom: {
        if: (value: any, { req }: Meta) => req.body.type && jobRequiresFile(req.body.type),
        options: async (value, meta): Promise<void> => {
          const { file } = meta.req;
          if (!file)
            throw new Error(customTypeErrorMessage('file._', meta));

          if (path.extname(file.originalname).toLowerCase() !== '.csv') {
            throw new Error(
              customTypeErrorMessage('file.ext', meta, { ext: 'CSV (comma-delimited)' }),
            );
          }
        },
      },
    },
  }),
);
