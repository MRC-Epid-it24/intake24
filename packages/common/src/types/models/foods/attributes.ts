import { OmitAndOptional } from '../model';

export type AttributeDefaultsAttributes = {
  id: string;
  sameAsBeforeOption: boolean;
  readyMealOption: boolean;
  reasonableAmount: number;
  useInRecipes: number;
};

export type AttributeDefaultsCreationAttributes = Omit<AttributeDefaultsAttributes, 'id'>;

export type FoodAttributeAttributes = {
  id: string;
  foodCode: string;
  sameAsBeforeOption: boolean | null;
  readyMealOption: boolean | null;
  reasonableAmount: number | null;
  useInRecipes: number | null;
};

export type FoodAttributeCreationAttributes = OmitAndOptional<
  FoodAttributeAttributes,
  'id',
  'sameAsBeforeOption' | 'readyMealOption' | 'reasonableAmount' | 'useInRecipes'
>;

export type CategoryAttributeAttributes = {
  id: string;
  categoryCode: string;
  sameAsBeforeOption: boolean | null;
  readyMealOption: boolean | null;
  reasonableAmount: number | null;
  useInRecipes: number | null;
};

export type CategoryAttributeCreationAttributes = OmitAndOptional<
  CategoryAttributeAttributes,
  'id',
  'sameAsBeforeOption' | 'readyMealOption' | 'reasonableAmount' | 'useInRecipes'
>;
