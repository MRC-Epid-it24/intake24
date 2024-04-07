import { checkSchema } from 'express-validator';

import { customErrorMessage, typeErrorMessage, validate } from '@intake24/api/http/requests/util';
import { defaultI18nMessages } from '@intake24/api/services';
import { isApplication } from '@intake24/common/types';
import { compareMessageKeys, validateTranslations } from '@intake24/i18n';

export default validate(
  checkSchema({
    translations: {
      in: ['body'],
      errorMessage: typeErrorMessage('array._'),
      isArray: { options: { min: 1 }, bail: true },
      custom: {
        options: async (value: any[], meta): Promise<void> => {
          value.forEach((translation) => {
            const { id, application, section, messages } = translation;
            const base = 'validation.attributes.i18n';

            if ([id, application, section].some(item => !item || typeof item !== 'string'))
              throw new Error(customErrorMessage('validation.attributes.structure', meta));

            if (!isApplication(application))
              throw new Error(customErrorMessage('validation.attributes.application', meta));

            if (!messages || Object.prototype.toString.call(messages) !== '[object Object]')
              throw new Error(customErrorMessage(`${base}.messages`, meta));

            if (!validateTranslations(messages))
              throw new Error(customErrorMessage(`${base}.messages`, meta));

            const defMessages = defaultI18nMessages[application][section];
            if (!defMessages)
              throw new Error(customErrorMessage(`${base}.defaults`, meta));

            if (!compareMessageKeys(defMessages, messages))
              throw new Error(customErrorMessage(`${base}.keys`, meta));
          });
        },
      },
    },
  }),
);
