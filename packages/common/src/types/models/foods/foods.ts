import { OmitAndOptional } from '../model';
import { FoodNutrientAttributes } from './nutrients';
import { FoodPortionSizeMethodCreationAttributes } from './portion-methods';

export type FoodAttributes = {
  code: string;
  name: string;
  foodGroupId: string;
  version: string;
};

export type FoodLocalAttributes = {
  id: string;
  foodCode: string;
  localeId: string;
  name: string;
  simpleName: string | null;
  version: string;
};

export interface FoodLocalCreationAttributes
  extends OmitAndOptional<FoodLocalAttributes, 'id', 'simpleName'> {
  nutrientMappings?: Omit<FoodNutrientAttributes, 'foodLocalId'>[];
  portionSizeMethods?: Omit<FoodPortionSizeMethodCreationAttributes, 'foodLocalId'>[];
}

export type FoodLocalAssociations = {
  main?: FoodAttributes;
};

export type FoodLocalListAttributes = {
  foodCode: string;
  localeId: string;
};

export type FoodCategoryAttributes = {
  foodCode: string;
  categoryCode: string;
};

export type FoodGroupAttributes = {
  id: string;
  name: string;
};

export type FoodGroupCreationAttributes = Omit<FoodGroupAttributes, 'id'>;

export type FoodGroupLocalAttributes = {
  id: string;
  foodGroupId: string;
  localeId: string;
  name: string;
};

export type FoodGroupLocalCreationAttributes = Omit<FoodGroupLocalAttributes, 'id'>;

export type AssociatedFoodAttributes = {
  id: string;
  foodCode: string;
  localeId: string;
  associatedFoodCode: string | null;
  associatedCategoryCode: string | null;
  text: string;
  linkAsMain: boolean;
  genericName: string;
};

export type AssociatedFoodCreationAttributes = OmitAndOptional<
  AssociatedFoodAttributes,
  'id',
  'associatedCategoryCode' | 'associatedFoodCode'
>;
