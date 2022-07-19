import type {
  Attributes,
  CategoryAttributes,
  FoodAssociations,
  FoodAttributes,
  FoodGroupAttributes,
  FoodLocalAttributes,
  Pagination,
} from '../../models';

export type FoodInput = {
  name: string;
  main: {
    code: string;
    name: string;
    foodGroupId: string;
    attributes: Attributes;
    parentCategories: Pick<CategoryAttributes, 'code' | 'name'>[];
  };
};

export type FoodListEntry = {
  id: string;
  code: string;
  localeId: string;
  name: string;
  englishName: string;
};

export type FoodsResponse = Pagination<FoodLocalAttributes>;

export type FoodEntry = FoodAttributes &
  Pick<FoodAssociations, 'attributes' | 'foodGroup' | 'parentCategories'>;

export interface FoodLocalEntry extends FoodLocalAttributes {
  main?: FoodEntry;
}

export type FoodGroupsResponse = Pagination<FoodGroupAttributes>;

export type FoodGroupEntry = FoodGroupAttributes;
