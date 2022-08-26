import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';
import {
  admin,
  api,
  compareMessageKeys,
  shared,
  survey,
  validateTranslations,
} from '@intake24/i18n';

const defaultMessages = { admin, api, survey, shared } as any;

export default validate(
  checkSchema({
    translations: {
      in: ['body'],
      errorMessage: 'Invalid language translations array',
      custom: {
        options: async (value): Promise<void> => {
          if (!Array.isArray(value) || !value.length) throw new Error();

          value.forEach((translation) => {
            const { id, application, section, messages } = translation;

            if ([id, application, section].some((item) => !item || typeof item !== 'string'))
              throw new Error();

            if (!messages || Object.prototype.toString.call(messages) !== '[object Object]')
              throw new Error();

            if (!validateTranslations(messages)) throw new Error();

            const defMessages = defaultMessages[application]?.en[section];
            if (!defMessages) throw new Error();

            if (!compareMessageKeys(defMessages, messages)) throw new Error();
          });
        },
      },
    },
  })
);
