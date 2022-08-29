import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';

import { imageFile } from '../../generic';

export default validate(
  checkSchema({
    image: imageFile,
    weight: {
      in: ['body'],
      errorMessage: typeErrorMessage('float._'),
      isFloat: true,
      toFloat: true,
    },
  })
);
