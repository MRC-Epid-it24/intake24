import { checkSchema } from 'express-validator';
import { GuideImage, ImageMap } from '@api/db/models/foods';
import validate from '@api/http/requests/validate';
import { unique } from '@api/http/rules';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Guide image ID must be unique code.',
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: GuideImage, condition: { field: 'id', value } }),
      },
    },
    imageMapId: {
      in: ['body'],
      errorMessage: 'Enter valid Image map ID.',
      isString: true,
      isEmpty: { negated: true },
      custom: {
        options: async (value): Promise<void> => {
          const imageMap = await ImageMap.findOne({ where: { id: value } });
          if (!imageMap) throw new Error('Enter valid Image map ID.');
        },
      },
    },
  })
);
