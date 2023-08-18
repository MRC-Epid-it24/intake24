import type { RequiredLocaleTranslation } from '../types';
import type { Nutrient } from './shared';
import { colors } from '../theme';

export type FeedbackMealChart = {
  colors: string[];
  nutrients: Nutrient[];
};

export type BaseMealTableField = {
  header: RequiredLocaleTranslation;
  value: RequiredLocaleTranslation;
};

export type MealTableFields = {
  standard: BaseMealTableField & {
    type: 'standard';
    fieldId: 'name' | 'hours' | 'minutes' | 'time' | 'duration';
  };
  custom: BaseMealTableField & { type: 'custom'; fieldId: string };
  nutrient: BaseMealTableField & {
    type: 'nutrient';
    fieldId: `nutrient-${string}`;
    types: string[];
  };
};

export type MealTableField = MealTableFields[keyof MealTableFields];
export type MealTableFieldType = MealTableFields[keyof MealTableFields]['type'];
export type MealTableFieldId = MealTableFields[keyof MealTableFields]['fieldId'];

export const mealTableFieldTypes: MealTableFieldType[] = ['standard', 'custom', 'nutrient'];
export const mealTableFieldStandardIds: MealTableFieldId[] = [
  'name',
  'hours',
  'minutes',
  'time',
  'duration',
];

export type FeedbackMealTable = {
  fields: MealTableField[];
};

export type FeedbackMeals = {
  chart: FeedbackMealChart;
  table: FeedbackMealTable;
};

export const defaultMeals: FeedbackMeals = {
  chart: {
    colors: Object.values(colors).slice(0, 5),
    nutrients: [{ id: ['1'], name: { en: 'Energy (kcal)' } }],
  },
  table: {
    fields: [
      {
        type: 'standard',
        fieldId: 'name',
        header: { en: 'Meal' },
        value: { en: '{value}' },
      },
      {
        type: 'standard',
        fieldId: 'time',
        header: { en: 'Time' },
        value: { en: '{value}' },
      },
      {
        type: 'standard',
        fieldId: 'duration',
        header: { en: 'Duration (min)' },
        value: { en: '{value} min' },
      },
      {
        type: 'nutrient',
        fieldId: 'nutrient-1',
        header: { en: 'Energy (kcal)' },
        value: { en: '{value}' },
        types: ['1'],
      },
      {
        type: 'custom',
        fieldId: 'ask-about-food-source',
        header: { en: 'Eating context' },
        value: { en: '{value}' },
      },
    ],
  },
};
