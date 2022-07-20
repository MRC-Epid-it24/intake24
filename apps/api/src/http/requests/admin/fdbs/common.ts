import { Category, NutrientTableRecord } from '@intake24/db';
import { useInRecipeTypes } from '@intake24/common/types/models';
import type { Schema } from 'express-validator';

export const attributes: Schema = {
  'main.attributes.readyMealOption': {
    in: ['body'],
    errorMessage: 'Ready meal option has to be true or false.',
    isBoolean: { options: { strict: true } },
    optional: { options: { nullable: true } },
  },
  'main.attributes.reasonableAmount': {
    in: ['body'],
    errorMessage: 'Reasonable amount has to be a number',
    isInt: true,
    optional: { options: { nullable: true } },
  },
  'main.attributes.sameAsBeforeOption': {
    in: ['body'],
    errorMessage: 'Same as before option has to be true or false.',
    isBoolean: { options: { strict: true } },
    optional: { options: { nullable: true } },
  },
  'main.attributes.useInRecipes': {
    in: ['body'],
    errorMessage: 'Enter valid use in recipes type.',
    isIn: { options: [Object.values(useInRecipeTypes)] },
    optional: { options: { nullable: true } },
  },
};

export const categories: Schema = {
  'main.parentCategories': {
    in: ['body'],
    errorMessage: 'Enter valid list of categories',
    custom: {
      options: async (value): Promise<void> => {
        if (!Array.isArray(value) || value.some(({ code }) => !code || typeof code !== 'string'))
          throw new Error('Enter valid list of categories.');

        if (!value.length) return;

        const code = value.map((item) => item.code);

        const availableCategories = await Category.count({ where: { code } });
        if (availableCategories !== value.length)
          throw new Error('Enter valid list of categories.');
      },
    },
  },
};

export const nutrients: Schema = {
  nutrientRecords: {
    in: ['body'],
    errorMessage: 'Enter valid list of nutrient records',
    custom: {
      options: async (value): Promise<void> => {
        if (!Array.isArray(value) || value.some(({ id }) => !id || typeof id !== 'string'))
          throw new Error('Enter valid list of nutrient records');

        if (!value.length) return;

        const id = value.map((item) => item.id);

        const availableRecords = await NutrientTableRecord.count({ where: { id } });
        if (availableRecords !== value.length)
          throw new Error('Enter valid list of nutrient records');
      },
    },
  },
};
