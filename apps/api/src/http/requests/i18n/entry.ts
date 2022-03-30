import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';

export default validate(
  checkSchema({
    languageId: {
      in: ['params'],
      errorMessage: `Invalid locale parameter.`,
      isLocale: true,
    },
    app: {
      in: ['query'],
      isIn: { options: [['admin', 'survey']] },
    },
  })
);
