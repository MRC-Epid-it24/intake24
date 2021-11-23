import { checkSchema } from 'express-validator';
import { ImageMap } from '@api/db/models/foods';
import validate from '@api/http/requests/validate';
import { identifierSafeChars, unique } from '@api/http/rules';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'Image map ID must be unique code (charset [a-zA-Z0-9-_]).',
      isEmpty: { negated: true },
      isWhitelisted: { options: identifierSafeChars },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: ImageMap, condition: { field: 'id', value } }),
      },
    },
    baseImage: {
      in: ['body'],
      custom: {
        options: async (value, { req: { file } }): Promise<void> => {
          if (!file) throw new Error('Missing base image map file.');

          if (file.mimetype.toLowerCase() !== 'image/jpeg')
            throw new Error('Invalid image file type.');
        },
      },
    },
  })
);
