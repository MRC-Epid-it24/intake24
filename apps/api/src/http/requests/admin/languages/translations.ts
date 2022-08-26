import { checkSchema } from 'express-validator';

import { validate } from '@intake24/api/http/requests/util';
import { defaultI18nMessages } from '@intake24/api/services';
import { isApplication } from '@intake24/common/types';
import { compareMessageKeys, validateTranslations } from '@intake24/i18n';

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

            if (!isApplication(application)) throw new Error();

            if (!messages || Object.prototype.toString.call(messages) !== '[object Object]')
              throw new Error();

            if (!validateTranslations(messages)) throw new Error();

            const defMessages = defaultI18nMessages[application][section];
            if (!defMessages) throw new Error();

            if (!compareMessageKeys(defMessages, messages)) throw new Error();
          });
        },
      },
    },
  })
);
