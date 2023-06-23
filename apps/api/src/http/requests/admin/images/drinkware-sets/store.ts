import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { DrinkwareSet, ImageMap } from '@intake24/db';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isEmpty: { negated: true, bail: true },
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
          const imageMap = await ImageMap.findOne({ where: { id: value } });
          if (!imageMap) throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
  })
);
