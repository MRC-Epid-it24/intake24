import type {
  CategoryAttributes,
  FoodAttributeAttributes,
  FoodAttributes,
  FoodGroupAttributes,
  FoodLocalAttributes,
  FoodPortionSizeMethodCreationAttributes,
  FoodPortionSizeMethodParameterCreationAttributes,
  NutrientTableRecordAttributes,
  Pagination,
} from '@intake24/db';

export type FoodInput = {
  name: string;
  main: {
    code: string;
    name: string;
    foodGroupId: string;
    attributes: FoodAttributeAttributes;
    parentCategories: Pick<CategoryAttributes, 'code' | 'name'>[];
  };
  nutrientRecords: Pick<NutrientTableRecordAttributes, 'id'>[];
  portionSizeMethods: (FoodPortionSizeMethodCreationAttributes & {
    parameters: FoodPortionSizeMethodParameterCreationAttributes[];
  })[];
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
};

export interface FoodLocalEntry extends FoodLocalAttributes {
  main?: FoodEntry;
}

export type FoodGroupsResponse = Pagination<FoodGroupAttributes>;

export type FoodGroupEntry = FoodGroupAttributes;
