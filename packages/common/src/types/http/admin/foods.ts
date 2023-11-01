import type { UseInRecipeType } from '@intake24/common/types';
import type {
  AssociatedFoodCreationAttributes,
  CategoryAttributes,
  FoodAttributeAttributes,
  FoodAttributes,
  FoodGroupAttributes,
  FoodLocalAttributes,
  FoodPortionSizeMethodCreationAttributes,
  FoodPortionSizeMethodParameterCreationAttributes,
  FoodsLocaleAttributes,
  NutrientTableRecordAttributes,
  Pagination,
} from '@intake24/db';

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

export type FoodInput = {
  name: string;
  main?: {
    code?: string;
    name?: string;
    foodGroupId?: string;
    attributes?: FoodAttributeAttributes;
    parentCategories?: Pick<CategoryAttributes, 'code' | 'name'>[];
  };
  nutrientRecords: Pick<NutrientTableRecordAttributes, 'id'>[];
  portionSizeMethods: (FoodPortionSizeMethodCreationAttributes & {
    parameters: FoodPortionSizeMethodParameterCreationAttributes[];
  })[];
  associatedFoods: AssociatedFoodCreationAttributes[];
};

export type FoodListEntry = {
  id: string;
  code: string;
  localeId: string;
  name: string;
  englishName: string;
};

export type FoodsResponse = Pagination<FoodListEntry>;

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

export type FoodGroupEntry = FoodGroupAttributes;
