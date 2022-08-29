import { checkSchema } from 'express-validator';

import { typeErrorMessage, validate } from '@intake24/api/http/requests/util';
import { frontEnds } from '@intake24/common/types';

export default validate(
  checkSchema({
    languageId: {
      in: ['params'],
      errorMessage: typeErrorMessage('locale._'),
      isLocale: true,
    },
    app: {
      in: ['query'],
      errorMessage: typeErrorMessage('in.options', { options: frontEnds }),
      isIn: { options: [frontEnds] },
    },
  })
);
