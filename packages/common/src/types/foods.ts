import type { RequiredLocaleTranslation } from '.';

export const useInRecipeTypes = {
  USE_ANYWHERE: 0,
  USE_AS_REGULAR_FOOD: 1,
  USE_AS_RECIPE_INGREDIENT: 2,
} as const;

export type UseInRecipeType = (typeof useInRecipeTypes)[keyof typeof useInRecipeTypes];

// Special Foods | Foods Builder section

export type SpecialFood = {
  code: string;
  name: RequiredLocaleTranslation;
  specialWords: string;
  steps: SpecialFoodStepsType[];
};

export type SpecialFoodsHeader = {
  code: string;
  description: string;
  name: string;
  synonyms: Set<string>;
  specialWords: string;
};

export type SpecialFoodStepsType = {
  order: number;
  code: string;
  specialFoodsCode: string;
  step_name: RequiredLocaleTranslation;
  step_description: RequiredLocaleTranslation;
};
