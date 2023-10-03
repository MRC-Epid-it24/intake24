import path from 'node:path';

import type { Meta } from 'express-validator';
import { checkSchema } from 'express-validator';
import { isPlainObject } from 'lodash';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { jobRequiresFile, nutrientTableJobs, pickJobParams } from '@intake24/common/types';

export default validate(
  checkSchema({
    type: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isIn: {
        options: [nutrientTableJobs],
        errorMessage: typeErrorMessage('in.options', { options: nutrientTableJobs }),
      },
    },
    params: {
      in: ['body'],
      customSanitizer: {
        options: (value, { req }) =>
          isPlainObject(value) && req.body.type && nutrientTableJobs.includes(req.body.type)
            ? pickJobParams(value, req.body.type)
            : {},
      },
    },
    'params.file': {
      in: ['body'],
      custom: {
        if: (value: any, { req }: Meta) => req.body.type && jobRequiresFile(req.body.type),
        options: async (value, meta): Promise<void> => {
          const { file } = meta.req;
          if (!file) throw new Error(customTypeErrorMessage('file._', meta));

          if (path.extname(file.originalname).toLowerCase() !== '.csv')
            throw new Error(
              customTypeErrorMessage('file.ext', meta, { ext: 'CSV (comma-delimited)' })
            );
        },
      },
    },
  })
);
