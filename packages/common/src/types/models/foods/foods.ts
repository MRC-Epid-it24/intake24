import { OmitAndOptional } from '../model';
import { NutrientMappingCreationAttributes } from './nutrients';
import { FoodPortionSizeMethodCreationAttributes } from './portion-methods';

export type FoodAttributes = {
  code: string;
  description: string;
  foodGroupId: number;
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
  nutrientMappings?: Omit<NutrientMappingCreationAttributes, 'foodLocalId'>[];
  portionSizeMethods?: Omit<FoodPortionSizeMethodCreationAttributes, 'foodLocalId'>[];
}

export type FoodLocalListAttributes = {
  foodCode: string;
  localeId: string;
};

export type FoodCategoryAttributes = {
  id: number;
  foodCode: string;
  categoryCode: string;
};

export type FoodCategoryCreationAttributes = Omit<FoodCategoryAttributes, 'id'>;
