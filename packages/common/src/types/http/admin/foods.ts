import { z } from 'zod';

import type { PortionSizeMethod } from '@intake24/common/surveys/portion-size';
import type { UseInRecipeType } from '@intake24/common/types';
import type {
  AssociatedFoodCreationAttributes,
  CategoryAttributes,
  FoodAttributeAttributes,
  FoodAttributes,
  FoodLocalAttributes,
  FoodPortionSizeMethodCreationAttributes,
  FoodsLocaleAttributes,
  NutrientTableRecordAttributes,
  Pagination,
} from '@intake24/db';

import type { AssociatedFood } from './associated-food';

export type InheritableAttributes = {
  readyMealOption?: boolean;
  sameAsBeforeOption?: boolean;
  reasonableAmount?: number;
  useInRecipes?: UseInRecipeType;
};

export type CreateGlobalFoodRequest = {
  code: string;
  name: string;
  foodGroupId: string;
  attributes: InheritableAttributes;
  parentCategories?: string[];
};

export type UpdateGlobalFoodRequest = Omit<CreateGlobalFoodRequest, 'code'>;

export type CreateLocalFoodRequest = {
  code: string;
  name: string;
  altNames?: Record<string, string[]>;
  tags?: string[];
  nutrientTableCodes: Record<string, string>;
  portionSizeMethods: PortionSizeMethod[];
  associatedFoods: AssociatedFood[];
};

export type CreateLocalFoodRequestOptions = {
  update: boolean;
  return: boolean;
};

export type UpdateLocalFoodRequest = Omit<CreateLocalFoodRequest, 'code'>;

export type CreateGlobalCategoryRequest = {
  code: string;
  version?: string;
  name: string;
  isHidden: boolean;
  attributes: InheritableAttributes;
  parentCategories?: string[];
};

export type UpdateGlobalCategoryRequest = Omit<CreateGlobalCategoryRequest, 'code' | 'version'>;

export type GlobalCategoryEntry = {
  code: string;
  version: string;
  name: string;
  isHidden: boolean;
  attributes: InheritableAttributes;
  parentCategories: string[];
};

export type CreateLocalCategoryRequest = {
  code: string;
  version?: string;
  name: string;
  portionSizeMethods: PortionSizeMethod[];
  tags?: string[];
};

export type UpdateLocalCategoryRequest = Omit<CreateLocalCategoryRequest, 'code' | 'version'>;

export type LocalCategoryEntry = {
  id: string;
  categoryCode: string;
  localeId: string;
  version: string;
  name: string;
  portionSizeMethods: PortionSizeMethod[];
};

export type FoodInput = Pick<FoodAttributes, 'code' | 'name' | 'foodGroupId'> & {
  parentCategories?: Pick<CategoryAttributes, 'code' | 'name'>[];
};

export type FoodLocalInput = {
  name: string;
  main?: {
    code?: string;
    name?: string;
    foodGroupId?: string;
    attributes?: FoodAttributeAttributes;
    locales?: FoodsLocaleAttributes[];
    parentCategories?: Pick<CategoryAttributes, 'code' | 'name'>[];
  };
  altNames?: Record<string, string[]>;
  tags?: string[];
  nutrientRecords: Pick<NutrientTableRecordAttributes, 'id'>[];
  portionSizeMethods: FoodPortionSizeMethodCreationAttributes[];
  associatedFoods: AssociatedFoodCreationAttributes[];
};

export type FoodLocalCopyInput = {
  code: string;
  name: string;
};

export type FoodListEntry = {
  id: string;
  code: string;
  localeId: string;
  name: string;
  englishName: string;
};

export type FoodsResponse = Pagination<FoodListEntry>;

export const foodGroupRequest = z.object({
  name: z.string().min(1).max(256),
});

export const foodGroupAttributes = z.object({
  id: z.string(),
  name: z.string(),
});

export type FoodGroupAttributes = z.infer<typeof foodGroupAttributes>;

export type FoodEntry = FoodAttributes & {
  attributes?: FoodAttributeAttributes;
  foodGroup?: FoodGroupAttributes;
  parentCategories?: CategoryAttributes[];
  locales?: FoodsLocaleAttributes[];
};

export interface FoodLocalEntry extends FoodLocalAttributes {
  main?: FoodEntry;
}

export type FoodGroupsResponse = Pagination<FoodGroupAttributes>;
