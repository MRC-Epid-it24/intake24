import {
  FoodGroupAttributes,
  FoodLocalAssociations,
  FoodLocalAttributes,
  Pagination,
} from '../../models';

export type FoodListEntry = {
  id: string;
  code: string;
  localeId: string;
  name: string;
  englishName: string;
};

export type FoodsResponse = Pagination<FoodLocalAttributes>;

export type FoodEntry = FoodLocalAttributes & Pick<FoodLocalAssociations, 'main'>;

export type FoodGroupsResponse = Pagination<FoodGroupAttributes>;

export type FoodGroupEntry = FoodGroupAttributes;
