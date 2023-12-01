import type { Request } from 'express';
import type { ParamSchema, Schema } from 'express-validator';

import type { SystemLocaleAttributes, WhereOptions } from '@intake24/db';
import languageBackends from '@intake24/api/food-index/language-backends';
import { typeErrorMessage } from '@intake24/api/http/requests/util';
import { unique } from '@intake24/api/http/rules';
import { textDirections } from '@intake24/common/types';
import { Language, Op, SystemLocale } from '@intake24/db';

const languageBackendCodes = Object.keys(languageBackends);

export const code: ParamSchema = {
  in: ['body'],
  errorMessage: typeErrorMessage('string.max', { max: 16 }),
  isString: { bail: true },
  isEmpty: { negated: true, bail: true },
  isLength: { bail: true, options: { max: 16 } },
  custom: {
    options: async (value): Promise<void> => {
      if (!(await unique({ model: SystemLocale, condition: { field: 'code', value } })))
        throw new Error('$unique');
    },
  },
};

export const defaults: Schema = {
  englishName: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 64 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { bail: true, options: { max: 64 } },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { localeId } = (meta.req as Request).params;
        const where: WhereOptions<SystemLocaleAttributes> = localeId
          ? { id: { [Op.ne]: localeId } }
          : {};

        if (
          !(await unique({
            model: SystemLocale,
            condition: { field: 'englishName', value },
            options: { where },
          }))
        )
          throw new Error('$unique');
      },
    },
  },
  localName: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 64 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { bail: true, options: { max: 64 } },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { localeId } = (meta.req as Request).params;
        const where: WhereOptions<SystemLocaleAttributes> = localeId
          ? { id: { [Op.ne]: localeId } }
          : {};

        if (
          !(await unique({
            model: SystemLocale,
            condition: { field: 'localName', value },
            options: { where },
          }))
        )
          throw new Error('$unique');
      },
    },
  },
  respondentLanguageId: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 16 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { bail: true, options: { max: 16 } },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { localeId } = (meta.req as Request).params;

        const locale = await SystemLocale.findByPk(localeId, {
          attributes: ['id', 'respondentLanguageId'],
        });
        if (locale?.respondentLanguageId === value) return;

        try {
          await (meta.req as Request).scope.cradle.aclService.findAndCheckVisibility(
            Language,
            'use',
            { attributes: ['id', 'ownerId', 'visibility'], where: { code: value } }
          );
        } catch (err) {
          throw new Error('$restricted');
        }
      },
    },
  },
  adminLanguageId: {
    in: ['body'],
    errorMessage: typeErrorMessage('string.max', { max: 16 }),
    isString: { bail: true },
    isEmpty: { negated: true, bail: true },
    isLength: { bail: true, options: { max: 16 } },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { localeId } = (meta.req as Request).params;

        const locale = await SystemLocale.findByPk(localeId, {
          attributes: ['id', 'adminLanguageId'],
        });
        if (locale?.adminLanguageId === value) return;

        try {
          await (meta.req as Request).scope.cradle.aclService.findAndCheckVisibility(
            Language,
            'use',
            { attributes: ['id', 'ownerId', 'visibility'], where: { code: value } }
          );
        } catch (err) {
          throw new Error('$restricted');
        }
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
    errorMessage: typeErrorMessage('string.max', { max: 16 }),
    isString: { bail: true },
    isLength: { bail: true, options: { max: 16 } },
    optional: { options: { nullable: true } },
    custom: {
      options: async (value, meta): Promise<void> => {
        const { localeId } = (meta.req as Request).params;

        const locale = await SystemLocale.findByPk(localeId, {
          attributes: ['id', 'prototypeLocaleId'],
        });
        if (locale?.prototypeLocaleId === value) return;

        try {
          await (meta.req as Request).scope.cradle.aclService.findAndCheckVisibility(
            SystemLocale,
            'use',
            { attributes: ['id', 'ownerId', 'visibility'], where: { code: value } }
          );
        } catch (err) {
          throw new Error('$restricted');
        }
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
  foodIndexEnabled: {
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: true,
  },
  foodIndexLanguageBackendId: {
    in: ['body'],
    errorMessage: typeErrorMessage('in.options', { options: languageBackendCodes }),
    isString: true,
    isIn: { options: [languageBackendCodes] },
    optional: true,
  },
};
