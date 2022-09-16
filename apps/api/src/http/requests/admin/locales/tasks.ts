/* eslint-disable no-case-declarations */
import { checkSchema } from 'express-validator';

import {
  customTypeErrorMessage,
  typeErrorMessage,
  validate,
} from '@intake24/api/http/requests/util';
import { pickJobParams } from '@intake24/common/types';
import { FoodsLocale } from '@intake24/db/models';

const jobOptions = ['LocaleFoodNutrientMapping', 'PairwiseSearchCopyAssociations'];

export default validate(
  checkSchema({
    job: {
      in: ['body'],
      errorMessage: typeErrorMessage('string._'),
      isString: true,
      isIn: {
        options: [jobOptions],
        bail: true,
        errorMessage: typeErrorMessage('in.options', { options: jobOptions }),
      },
    },
    params: {
      in: ['body'],
      errorMessage: 'Invalid job type parameters.',
      custom: {
        options: async (value, meta): Promise<void> => {
          switch (meta.req.body.job) {
            case 'PairwiseSearchCopyAssociations':
              if (
                typeof value?.sourceLocaleId !== 'string' ||
                typeof value?.targetLocaleId !== 'string'
              )
                throw new Error(customTypeErrorMessage('string._', meta));

              const { sourceLocaleId, targetLocaleId } = value;

              const locales = await FoodsLocale.findAll({
                where: { id: [sourceLocaleId, targetLocaleId] },
              });
              if (locales.length !== 2) throw new Error(customTypeErrorMessage('exists._', meta));
              break;
            case 'LocaleFoodNutrientMapping':
              if (typeof value?.localeId !== 'string')
                throw new Error(customTypeErrorMessage('string._', meta));

              const locale = await FoodsLocale.findOne({ where: { id: value.localeId } });
              if (!locale) throw new Error(customTypeErrorMessage('exists._', meta));
              break;
            default:
              throw new Error();
          }
        },
        bail: true,
      },
      customSanitizer: {
        options: (value, { req }) => pickJobParams(value, req.body.job),
      },
    },
  })
);
