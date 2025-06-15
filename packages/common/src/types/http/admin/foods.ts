import type { Pagination } from '../generic';
import type { AssociatedFood } from './associated-food';

import { z } from 'zod';
import type { PortionSizeMethod } from '@intake24/common/surveys/portion-size';
import type { UseInRecipeType } from '@intake24/common/types';

import type {
  AssociatedFoodAttributes,
  AssociatedFoodCreationAttributes,
  FoodPortionSizeMethodAttributes,
  FoodsLocaleAttributes,
  NutrientTableRecordAttributes,
} from '@intake24/db';
import { CategoryAttributes } from './categories';
import { PortionSizeMethodAttributes } from './portion-size-methods';

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

export type CreateFoodRequest = {
  code: string;
  englishName: string;
  name: string;
  altNames?: Record<string, string[]>;
  foodGroupId: string;
  tags?: string[];
  excludeTags?: string[];
  parentCategories?: string[];
  nutrientTableCodes: Record<string, string>;
  portionSizeMethods: PortionSizeMethod[];
  associatedFoods: AssociatedFood[];
};

export type CreateFoodRequestOptions = {
  update: boolean;
  return: boolean;
};

export const foodAttributes = z.object({
  id: z.string(),
  code: z.string().min(1).max(32),
  localeId: z.string().min(1).max(16),
  englishName: z.string().min(1).max(256),
  name: z.string().min(1).max(256),
  simpleName: z.string().nullish(),
  altNames: z.record(z.string().array()),
  foodGroupId: z.string(),
  tags: z.string().array(),
  excludeTags: z.string().array(),
  version: z.string().uuid(),
});
export type FoodAttributes = z.infer<typeof foodAttributes>;

export type FoodInput = {
  code: string;
  name: string;
  englishName: string;
  foodGroupId: string;
  parentCategories?: Pick<CategoryAttributes, 'id'>[];
  altNames?: Record<string, string[]>;
  tags?: string[];
  excludeTags?: string[];
  nutrientRecords: Pick<NutrientTableRecordAttributes, 'id'>[];
  portionSizeMethods: PortionSizeMethodAttributes[];
  associatedFoods: AssociatedFoodCreationAttributes[];
};

export type FoodCopyInput = {
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
  foodGroup?: FoodGroupAttributes;
  parentCategories?: CategoryAttributes[];
  locales?: FoodsLocaleAttributes[];
};

export interface FoodLocalEntry extends FoodAttributes {
  main?: FoodEntry;
  associatedFoods?: AssociatedFoodAttributes[];
  portionSizeMethods?: FoodPortionSizeMethodAttributes[];
  nutrientRecords?: NutrientTableRecordAttributes[];
}

export type FoodGroupsResponse = Pagination<FoodGroupAttributes>;
