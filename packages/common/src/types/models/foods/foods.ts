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

export type FoodLocalListAttributes = {
  foodCode: string;
  localeId: string;
};

export type FoodCategoryAttributes = {
  foodCode: string;
  categoryCode: string;
};
