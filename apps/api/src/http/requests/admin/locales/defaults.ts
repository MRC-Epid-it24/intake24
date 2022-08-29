import type { Request } from 'express';
import type { Schema } from 'express-validator';

import type { LocaleAttributes } from '@intake24/common/types/models';
import type { WhereOptions } from '@intake24/db';
import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { textDirections } from '@intake24/common/types';
import { Language, Op, SystemLocale } from '@intake24/db';

const defaults: Schema = {
  englishName: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { localeId } = (meta.req as Request).params;
        const where: WhereOptions<LocaleAttributes> = localeId ? { id: { [Op.ne]: localeId } } : {};

        if (
          !(await unique({
            model: SystemLocale,
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
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { localeId } = (meta.req as Request).params;
        const where: WhereOptions<LocaleAttributes> = localeId ? { id: { [Op.ne]: localeId } } : {};

        if (
          !(await unique({
            model: SystemLocale,
            condition: { field: 'localName', value },
            options: { where },
          }))
        )
          throw new Error(customTypeErrorMessage('unique._', meta));
      },
    },
  },
  respondentLanguageId: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const language = await Language.findByPk(value);
        if (!language) throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
  adminLanguageId: {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    custom: {
      options: async (value, meta): Promise<void> => {
        const language = await Language.findByPk(value);
        if (!language) throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
  countryFlagCode: {
    in: ['body'],
    errorMessage: typeErrorMessage('locale._'),
    isLocale: true,
  },
  prototypeLocaleId: {
    in: ['body'],
    errorMessage: 'Enter valid locale.',
    isString: { bail: true },
    optional: { options: { nullable: true } },
    custom: {
      options: async (value, meta): Promise<void> => {
        const locale = await SystemLocale.findByPk(value);
        if (!locale) throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
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
