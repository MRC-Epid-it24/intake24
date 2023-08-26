import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { LanguageAttributes, WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { textDirections } from '@intake24/common/types';
import { Language, Op } from '@intake24/db';

const defaults: Schema = {
  englishName: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 512 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { bail: true, options: { max: 512 } },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { languageId } = (meta.req as Request).params;
        const where: WhereOptions<LanguageAttributes> = languageId
          ? { id: { [Op.ne]: languageId } }
          : {};

        if (
          !(await unique({
            model: Language,
            condition: { field: 'englishName', value },
            options: { where },
          }))
        )
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
  localName: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 512 }),
    isString: true,
    isEmpty: { negated: true },
    isLength: { bail: true, options: { max: 512 } },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { languageId } = (meta.req as Request).params;
        const where: WhereOptions<LanguageAttributes> = languageId
          ? { id: { [Op.ne]: languageId } }
          : {};

        if (
          !(await unique({
            model: Language,
            condition: { field: 'localName', value },
            options: { where },
          }))
        )
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
  countryFlagCode: {
    in: ['body'],
    errorMessage: typeErrorMessage('locale._'),
    isLocale: true,
  },
  textDirection: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
    isIn: {
      options: [textDirections],
      errorMessage: typeErrorMessage('in.options', { options: textDirections }),
    },
  },
};

export default defaults;
