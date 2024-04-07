import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { identifierSafeChars } from '@intake24/common/rules';
import { GuideImage, ImageMap } from '@intake24/db';

import defaults from './defaults';

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
          if (!(await unique({ model: GuideImage, condition: { field: 'id', value } })))
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
          if (!imageMap)
            throw new Error(customTypeErrorMessage('exists._', meta));
        },
      },
    },
  }),
);
