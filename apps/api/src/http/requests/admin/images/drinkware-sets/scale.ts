import { checkSchema } from 'express-validator';
import { IsBooleanOptions } from 'express-validator/src/options';

import { imageFile } from '@intake24/api/http/requests/admin/generic';
import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';
import { identifierSafeChars } from '@intake24/api/http/rules';

export default {
  read: validate(
    checkSchema({
      drinkwareSetId: {
        in: ['params'],
        isString: { errorMessage: typeErrorMessage('string._') },
      },
      choiceId: {
        in: ['params'],
        isInt: { errorMessage: typeErrorMessage('int._') },
      },
    })
  ),
  store: validate(
    checkSchema({
      drinkwareSetId: {
        in: ['params'],
        isString: { errorMessage: typeErrorMessage('string._') },
        isWhitelisted: {
          options: identifierSafeChars,
          errorMessage: typeErrorMessage('safeChars._'),
        },
      },
      choiceId: {
        in: ['params'],
        isInt: { errorMessage: typeErrorMessage('_.int') },
      },
      update: {
        in: ['query'],
        isBoolean: { errorMessage: typeErrorMessage('boolean._') },
      },
      baseImage: imageFile,
      'label.*': {
        in: ['body'],
        isWhitelisted: {
          options: ['12', '32'],
          bail: true,
          errorMessage: typeErrorMessage('restricted._'),
        },
      },
    })
  ),
};
