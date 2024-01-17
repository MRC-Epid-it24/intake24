import type { RequiredLocaleTranslation } from '.';

export const useInRecipeTypes = {
  USE_ANYWHERE: 0,
  USE_AS_REGULAR_FOOD: 1,
  USE_AS_RECIPE_INGREDIENT: 2,
} as const;

export type UseInRecipeType = (typeof useInRecipeTypes)[keyof typeof useInRecipeTypes];

// Special Foods | Foods Builder section

export type RecipeFood = {
  code: string;
  name: string;
  recipeWord: string;
  steps: RecipeFoodStepsType[];
};

export type RecipeFoodsHeader = {
  code: string;
  description: string;
  name: string;
  synonyms: Set<string>;
  recipeWord: string;
};

export type RecipeFoodStepsType = {
  order: number;
  code: string;
  recipeFoodsCode: string;
  name: RequiredLocaleTranslation;
  description: RequiredLocaleTranslation;
  localeId: string;
  categoryCode: string;
  repeatable: boolean;
  required: boolean;
};
