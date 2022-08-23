import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { LanguageAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { unique } from '@intake24/api/http/rules';
import { textDirections } from '@intake24/common/types';
import { Language, Op } from '@intake24/db';

const defaults: Schema = {
  englishName: {
    in: ['body'],
    errorMessage: 'Enter unique english name.',
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { languageId } = (req as Request).params;
        const where: WhereOptions<LanguageAttributes> = languageId
          ? { id: { [Op.ne]: languageId } }
          : {};

        return unique({
          model: Language,
          condition: { field: 'englishName', value },
          options: { where },
        });
      },
    },
  },
  localName: {
    in: ['body'],
    errorMessage: 'Enter unique local name.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { languageId } = (req as Request).params;
        const where: WhereOptions<LanguageAttributes> = languageId
          ? { id: { [Op.ne]: languageId } }
          : {};

        return unique({
          model: Language,
          condition: { field: 'localName', value },
          options: { where },
        });
      },
    },
  },
  countryFlagCode: {
    in: ['body'],
    errorMessage: 'Enter valid locale code.',
    isLocale: true,
  },
  textDirection: {
    in: ['body'],
    errorMessage: `Enter 'ltr' ot 'rlt' values.`,
    isString: true,
    isEmpty: { negated: true },
    isIn: { options: [textDirections] },
  },
};

export default defaults;
