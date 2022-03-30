import type { Request } from 'express';
import type { Schema } from 'express-validator';
import { Op, WhereOptions, Language } from '@intake24/db';
import { unique } from '@intake24/api/http/rules';
import { LanguageAttributes } from '@intake24/common/types/models';

const defaults: Schema = {
  englishName: {
    in: ['body'],
    errorMessage: 'Enter unique english name.',
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
    isIn: { options: [['rtl', 'ltr']] },
  },
};

export default defaults;
