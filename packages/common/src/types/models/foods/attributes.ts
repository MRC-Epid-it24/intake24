import type { Nullable, OmitAndOptional } from '../../common';

export const useInRecipeTypes = {
  USE_ANYWHERE: 0,
  USE_AS_REGULAR_FOOD: 1,
  USE_AS_RECIPE_INGREDIENT: 2,
} as const;

export type UseInRecipeType = (typeof useInRecipeTypes)[keyof typeof useInRecipeTypes];

export type Attributes = {
  sameAsBeforeOption: boolean;
  readyMealOption: boolean;
  reasonableAmount: number;
  useInRecipes: UseInRecipeType;
};

export type AttributeType = keyof Attributes;

export interface AttributeDefaultsAttributes extends Attributes {
  id: string;
}

export type AttributeDefaultsCreationAttributes = Omit<AttributeDefaultsAttributes, 'id'>;

export interface FoodAttributeAttributes extends Nullable<Attributes> {
  id: string;
  foodCode: string;
}

export type FoodAttributeCreationAttributes = OmitAndOptional<
  FoodAttributeAttributes,
  'id',
  'sameAsBeforeOption' | 'readyMealOption' | 'reasonableAmount' | 'useInRecipes'
>;

export interface CategoryAttributeAttributes extends Nullable<Attributes> {
  id: string;
  categoryCode: string;
}

export type CategoryAttributeCreationAttributes = OmitAndOptional<
  CategoryAttributeAttributes,
  'id',
  'sameAsBeforeOption' | 'readyMealOption' | 'reasonableAmount' | 'useInRecipes'
>;
