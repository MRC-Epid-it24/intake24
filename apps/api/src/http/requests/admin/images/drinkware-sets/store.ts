import { checkSchema } from 'express-validator';

import validate from '@intake24/api/http/requests/validate';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import { DrinkwareSet, GuideImage } from '@intake24/db';

import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Drinkware set ID must be unique code (charset [a-zA-Z0-9-_]).',
      isEmpty: { negated: true },
      isWhitelisted: { options: identifierSafeChars },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: DrinkwareSet, condition: { field: 'id', value } }),
      },
    },
    guideImageId: {
      in: ['body'],
      errorMessage: 'Enter valid Guide image ID.',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> => {
          const guideImage = await GuideImage.findOne({ where: { id: value } });
          if (!guideImage) throw new Error();
        },
      },
    },
  })
);