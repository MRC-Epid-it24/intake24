import { checkSchema } from 'express-validator';
import { isPlainObject } from 'lodash';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    objects: {
      in: ['body'],
      errorMessage: typeErrorMessage('array._'),
      isArray: { bail: true },
    },
    'objects.*.id': {
      in: ['body'],
      errorMessage: typeErrorMessage('int._', { attributePath: 'id' }),
      isInt: { bail: true },
    },
    'objects.*.label': {
      in: ['body'],
      custom: {
        options: async (value, meta): Promise<void> => {
          if (!isPlainObject(value)) throw new Error(customTypeErrorMessage('object._', meta));
        },
      },
    },
    'objects.*.label.*': {
      in: ['body'],
      errorMessage: typeErrorMessage('string._', { attributePath: 'label' }),
      isString: true,
      optional: { options: { nullable: true } },
    },
    'objects.*.weight': {
      in: ['body'],
      errorMessage: typeErrorMessage('float._', { attributePath: 'weight' }),
      isFloat: true,
    },
  })
);
