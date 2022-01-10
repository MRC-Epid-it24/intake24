import { checkSchema } from 'express-validator';
import { AsServedSet } from '@intake24/db';
import validate from '@intake24/api/http/requests/validate';
import { identifierSafeChars, unique } from '@intake24/api/http/rules';
import defaults from './defaults';

export default validate(
  checkSchema({
    ...defaults,
    id: {
      in: ['body'],
      errorMessage: 'As Served set ID must be unique code (charset [a-zA-Z0-9-_]).',
      isEmpty: { negated: true },
      isWhitelisted: { options: identifierSafeChars },
      custom: {
        options: async (value): Promise<void> =>
          unique({ model: AsServedSet, condition: { field: 'id', value } }),
      },
    },
    selectionImage: {
      in: ['body'],
      custom: {
        options: async (value, { req: { file } }): Promise<void> => {
          if (!file) throw new Error('Missing selection image file.');

          if (file.mimetype.toLowerCase() !== 'image/jpeg')
            throw new Error('Invalid image file type.');
        },
      },
    },
  })
);
