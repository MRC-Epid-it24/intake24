import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { toStandardUnitId } from '@intake24/api/util';
import { StandardUnit } from '@intake24/db';

import { defaults } from './defaults';

export default validate(
  checkSchema({
    id: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: { bail: true },
      isEmpty: { negated: true, bail: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (
            !(await unique({
              model: StandardUnit,
              condition: {
                field: 'id',
                value: toStandardUnitId(value),
              },
            }))
          )
            throw new Error(customTypeErrorMessage('unique._', meta));
        },
        bail: true,
      },
      customSanitizer: { options: (value: string) => toStandardUnitId(value) },
    },
    ...defaults,
  })
);
