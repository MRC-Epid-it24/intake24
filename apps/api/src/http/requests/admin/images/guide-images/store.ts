import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { GuideImage, ImageMap } from '@intake24/db';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Guide image ID must be unique code (charset [a-zA-Z0-9-_]).',
      isEmpty: { negated: true, bail: true },
      isWhitelisted: { options: identifierSafeChars, bail: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: GuideImage, condition: { field: 'id', value } }),
      },
    },
    imageMapId: {
      in: ['body'],
      errorMessage: 'Enter valid Image map ID.',
      isString: { bail: true },
      isEmpty: { negated: true, bail: true },
      custom: {
        options: async (value): Promise<void> => {
          const imageMap = await ImageMap.findOne({ where: { id: value } });
          if (!imageMap) throw new Error('Enter valid Image map ID.');
        },
      },
    },
  })
);
