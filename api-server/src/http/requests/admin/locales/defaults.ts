import { Request } from 'express';
import { Schema } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import { Language, Locale } from '@/db/models/system';
import unique from '@/http/rules/unique';

const defaults: Schema = {
  englishName: {
    in: ['body'],
    errorMessage: 'Enter unique english name.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value, { req }): Promise<void> => {
        const { localeId } = (req as Request).params;
        const except: WhereOptions = localeId ? { id: { [Op.ne]: localeId } } : {};

        return unique({ model: Locale, condition: { field: 'englishName', value }, except });
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
        const { localeId } = (req as Request).params;
        const except: WhereOptions = localeId ? { id: { [Op.ne]: localeId } } : {};

        return unique({ model: Locale, condition: { field: 'localName', value }, except });
      },
    },
  },
  respondentLanguageId: {
    in: ['body'],
    errorMessage: 'Enter valid language id.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        const language = await Language.findOne({ where: { id: value } });

        return language ? Promise.resolve() : Promise.reject(new Error('Enter valid language id.'));
      },
    },
  },
  adminLanguageId: {
    in: ['body'],
    errorMessage: 'Enter valid language id.',
    isString: true,
    isEmpty: { negated: true },
    custom: {
      options: async (value): Promise<void> => {
        const language = await Language.findOne({ where: { id: value } });

        return language ? Promise.resolve() : Promise.reject(new Error('Enter valid language id.'));
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
    isString: true,
    optional: { options: { nullable: true } },
    custom: {
      options: async (value): Promise<void> => {
        const locale = await Locale.findOne({ where: { id: value } });

        return locale ? Promise.resolve() : Promise.reject(new Error('Enter valid locale.'));
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
