import type { RequiredLocaleTranslation } from '../types';

export type TopFoodNutrientType = {
  id: string;
  name: RequiredLocaleTranslation;
};

export type TopFoods = {
  max: number;
  colors: string[];
  nutrientTypes: TopFoodNutrientType[];
};

export const defaultTopFoods: TopFoods = {
  max: 5,
  colors: ['#FF6384', '#36A2EB', '#FFCE56', '#9c27b0', '#8bc34a', '#999999'],
  nutrientTypes: [
    { id: '1', name: { en: 'Energy' } },
    { id: '23', name: { en: 'Sugar' } },
    { id: '50', name: { en: 'Saturated fat' } },
  ],
};
