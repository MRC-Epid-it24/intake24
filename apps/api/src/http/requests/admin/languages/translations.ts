import { checkSchema } from 'express-validator';
import validate from '@intake24/api/http/requests/validate';
import { validateTranslations } from '@intake24/i18n/util';

export default validate(
  checkSchema({
    translations: {
      in: ['body'],
      errorMessage: 'Invalid language translation object',
      custom: {
        options: async (value): Promise<void> => {
          if (!Array.isArray(value) || !value.length) throw new Error();

          value.forEach((item) => {
            const { id, messages } = item;

            if (!id || typeof id !== 'string') throw new Error();

            if (!messages || Object.prototype.toString.call(messages) !== '[object Object]')
              throw new Error();

            if (!validateTranslations(messages)) throw new Error();
          });
        },
      },
    },
  })
);
