import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { LocaleAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { unique } from '@intake24/api/http/rules';
import { Language, Op, SystemLocale } from '@intake24/db';

const defaults: Schema = {
  englishName: {
    in: ['body'],
    errorMessage: 'Enter unique english name.',
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { localeId } = (req as Request).params;
        const where: WhereOptions<LocaleAttributes> = localeId ? { id: { [Op.ne]: localeId } } : {};

        return unique({
          model: SystemLocale,
          condition: { field: 'englishName', value },
          options: { where },
        });
      },
    },
  },
  localName: {
    in: ['body'],
    errorMessage: 'Enter unique local name.',
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { localeId } = (req as Request).params;
        const where: WhereOptions<LocaleAttributes> = localeId ? { id: { [Op.ne]: localeId } } : {};

        return unique({
          model: SystemLocale,
          condition: { field: 'localName', value },
          options: { where },
        });
      },
    },
  },
  respondentLanguageId: {
    in: ['body'],
    errorMessage: 'Enter valid language id.',
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value): Promise<void> => {
        const language = await Language.findByPk(value);
        if (!language) throw new Error('Enter valid language id.');
      },
    },
  },
  adminLanguageId: {
    in: ['body'],
    errorMessage: 'Enter valid language id.',
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value): Promise<void> => {
        const language = await Language.findByPk(value);
        if (!language) throw new Error('Enter valid language id.');
      },
    },
  },
  countryFlagCode: {
    in: ['body'],
    errorMessage: 'Enter valid locale code.',
    isLocale: true,
  },
  prototypeLocaleId: {
    in: ['body'],
    errorMessage: 'Enter valid locale.',
    isString: { bail: true },
    optional: { options: { nullable: true } },
    custom: {
      options: async (value): Promise<void> => {
        const locale = await SystemLocale.findByPk(value);
        if (!locale) throw new Error('Enter valid llocale.');
      },
    },
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
