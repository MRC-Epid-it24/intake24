import type { RequiredLocaleTranslation } from '../types';
import type { NutrientGroup } from './shared';

export type FeedbackMealChart = {
  colors: string[];
  nutrientGroups: NutrientGroup[];
};

export type BaseMealTableField = {
  header: RequiredLocaleTranslation;
  item: RequiredLocaleTranslation;
};

export type MealTableFields = {
  standard: BaseMealTableField & {
    type: 'standard';
    fieldId: 'name' | 'hours' | 'minutes' | 'time';
  };
  custom: BaseMealTableField & { type: 'custom'; fieldId: string };
  nutrientGroup: BaseMealTableField & {
    type: 'nutrientGroup';
    fieldId: string;
    nutrientTypes: string[];
  };
};

export type MealTableField = MealTableFields[keyof MealTableFields];

export type FeedbackMealTable = {
  fields: MealTableField[];
};

export type FeedbackMealStats = {
  chart: FeedbackMealChart;
  table: FeedbackMealTable;
};

export const defaultMeals: FeedbackMealStats = {
  chart: {
    colors: ['#FF6384', '#36A2EB', '#FFCE56', '#9c27b0', '#8bc34a', '#999999'],
    nutrientGroups: [{ id: ['1'], name: { en: 'Energy (kcal)' } }],
  },
  table: {
    fields: [
      {
        type: 'standard',
        fieldId: 'name',
        header: { en: 'Meal' },
        item: { en: '{value}' },
      },
      {
        type: 'standard',
        fieldId: 'time',
        header: { en: 'Time' },
        item: { en: '{value}' },
      },
      {
        type: 'nutrientGroup',
        fieldId: 'nutrientGroup-1',
        header: { en: 'Energy (kcal)' },
        item: { en: '{value}' },
        nutrientTypes: ['1'],
      },
      {
        type: 'custom',
        fieldId: 'ask-about-food-source',
        header: { en: 'Eating context' },
        item: { en: '{value}' },
      },
    ],
  },
};
