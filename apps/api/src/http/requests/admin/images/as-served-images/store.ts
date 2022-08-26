import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';

export default validate(
  checkSchema({
    image: {
      in: ['body'],
      custom: {
        options: async (value, { req: { file } }): Promise<void> => {
          if (!file) throw new Error('Missing image file.');

          if (file.mimetype.toLowerCase() !== 'image/jpeg')
            throw new Error('Invalid image file type.');
        },
      },
    },
    weight: {
      in: ['body'],
      errorMessage: 'Enter a number.',
      isFloat: true,
      toFloat: true,
    },
  })
);
