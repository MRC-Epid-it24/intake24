import type { Schema } from 'express-validator';

import { customTypeErrorMessage, typeErrorMessage } from '@intake24/api/http/requests/util';
import {
  portionSizeMethods as portionSizeMethodIds,
  useInRecipeTypes,
} from '@intake24/common/types';
import { Category, NutrientTableRecord } from '@intake24/db';

export const attributes: Schema = {
  'main.attributes.readyMealOption': {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: { options: { nullable: true } },
  },
  'main.attributes.reasonableAmount': {
    in: ['body'],
    errorMessage: typeErrorMessage('int._'),
    isInt: true,
    optional: { options: { nullable: true } },
  },
  'main.attributes.sameAsBeforeOption': {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
    optional: { options: { nullable: true } },
  },
  'main.attributes.useInRecipes': {
    in: ['body'],
    errorMessage: typeErrorMessage('in.options', { options: Object.values(useInRecipeTypes) }),
    isIn: { options: [Object.values(useInRecipeTypes)] },
    optional: { options: { nullable: true } },
  },
};

export const categories: Schema = {
  'main.parentCategories': {
    in: ['body'],
    errorMessage: typeErrorMessage('array._'),
    isArray: { bail: true },
    custom: {
      options: async (value: any[], meta): Promise<void> => {
        if (value.some(({ code }) => !code || typeof code !== 'string'))
          throw new Error(customTypeErrorMessage('array.string', meta));

        if (!value.length) return;

        const code = value.map((item) => item.code);

        const availableCategories = await Category.count({ where: { code } });
        if (availableCategories !== value.length)
          throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
};

export const nutrients: Schema = {
  nutrientRecords: {
    in: ['body'],
    errorMessage: typeErrorMessage('array._'),
    isArray: { bail: true },
    custom: {
      options: async (value: any[], meta): Promise<void> => {
        if (value.some(({ id }) => !id || typeof id !== 'string'))
          throw new Error(customTypeErrorMessage('array.string', meta));

        if (!value.length) return;

        const id = value.map((item) => item.id);

        const availableRecords = await NutrientTableRecord.count({ where: { id } });
        if (availableRecords !== value.length)
          throw new Error(customTypeErrorMessage('exists._', meta));
      },
    },
  },
};

export const portionSizeMethods: Schema = {
  portionSizeMethods: {
    in: ['body'],
    errorMessage: typeErrorMessage('array._'),
    isArray: { bail: true },
  },
  'portionSizeMethods.*.id': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isInt: true,
    optional: true,
  },
  'portionSizeMethods.*.method': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isIn: {
      options: [portionSizeMethodIds],
      errorMessage: typeErrorMessage('in.options', { options: portionSizeMethodIds }),
    },
  },
  'portionSizeMethods.*.description': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
  },
  'portionSizeMethods.*.imageUrl': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
  },
  'portionSizeMethods.*.useForRecipes': {
    in: ['body'],
    errorMessage: typeErrorMessage('boolean._'),
    isBoolean: { options: { strict: true } },
  },
  'portionSizeMethods.*.conversionFactor': {
    in: ['body'],
    errorMessage: typeErrorMessage('float._'),
    isFloat: true,
    toFloat: true,
  },
  'portionSizeMethods.*.orderBy': {
    in: ['body'],
    errorMessage: typeErrorMessage('number._'),
    isInt: true,
  },
  'portionSizeMethods.*.parameters': {
    in: ['body'],
    errorMessage: typeErrorMessage('array._'),
    isArray: { bail: true },
  },
  'portionSizeMethods.*.parameters.*.id': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isInt: true,
    optional: true,
  },
  'portionSizeMethods.*.parameters.*.name': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
  },
  'portionSizeMethods.*.parameters.*.value': {
    in: ['body'],
    errorMessage: typeErrorMessage('string._'),
    isString: true,
    isEmpty: { negated: true },
  },
};
