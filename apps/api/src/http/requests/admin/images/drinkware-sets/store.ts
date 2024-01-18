import type { Meta } from 'express-validator';
import { body, check, checkSchema, oneOf } from 'express-validator';
import validator from 'validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { DrinkwareSet, ImageMap } from '@intake24/db';

import defaults from './defaults';
import isInt = validator.isInt;
import isURL = validator.isURL;
import { isArray } from 'lodash';

async function validateScale(value: any, meta: Meta): Promise<void> {
  if (value.version === 1) {
    if (!isInt(value.width)) throw new Error(customTypeErrorMessage('int._', meta));
    if (!isInt(value.height)) throw new Error(customTypeErrorMessage('int._', meta));
    if (!isInt(value.emptyLevel)) throw new Error(customTypeErrorMessage('int._', meta));
    if (!isInt(value.fullLevel)) throw new Error(customTypeErrorMessage('int._', meta));
    if (!isInt(value.choiceId)) throw new Error(customTypeErrorMessage('int._', meta));
    if (!isURL(value.baseImageUrl)) throw new Error(customTypeErrorMessage('url._', meta));
    if (!isURL(value.overlayImageUrl)) throw new Error(customTypeErrorMessage('url._', meta));
  } else {
    if (!isInt(value.choiceId)) throw new Error(customTypeErrorMessage('int._', meta));
    if (!isInt(value.baseImageId)) throw new Error(customTypeErrorMessage('int._', meta));
    if (!isArray(value.outlineCoordinates))
      throw new Error(customTypeErrorMessage('array._', meta));
  }
}

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: typeErrorMessage('string.max', { max: 32 }),
      isEmpty: { negated: true, bail: true },
      isLength: { bail: true, options: { max: 32 } },
      isWhitelisted: {
        options: identifierSafeChars,
        bail: true,
        errorMessage: typeErrorMessage('safeChars._'),
      },
      custom: {
        options: async (value, meta): Promise<void> => {
          if (!(await unique({ model: DrinkwareSet, condition: { field: 'id', value } })))
            throw new Error(customTypeErrorMessage('unique._', meta));
        },
      },
    },
    imageMapId: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: { bail: true },
      isEmpty: { negated: true, bail: true },
      custom: {
        options: async (value, meta): Promise<void> => {
          const imageMap = await ImageMap.findByPk(value, { attributes: ['id'] });
          if (!imageMap) throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
    scales: {
      in: ['body'],
      optional: {},
      isArray: { bail: true },
    },
    'scales.*.version': {
      in: ['body'],
      isInt: { bail: true, options: { min: 1, max: 2 } },
    },
    'scales.*.': {
      in: ['body'],
      custom: {
        options: validateScale,
      },
    },
  })
);
