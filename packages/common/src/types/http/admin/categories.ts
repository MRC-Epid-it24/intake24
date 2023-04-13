import type {
  CategoryAttributeAttributes,
  CategoryAttributes,
  CategoryLocalAttributes,
  CategoryPortionSizeMethodCreationAttributes,
  CategoryPortionSizeMethodParameterCreationAttributes,
  Pagination,
} from '@intake24/db';

import type { FoodListEntry } from './foods';

export type CategoryInput = {
  name: string;
  main: {
    code: string;
    name: string;
    isHidden: boolean;
    attributes: CategoryAttributeAttributes;
    parentCategories: Pick<CategoryAttributes, 'code' | 'name'>[];
  };
  portionSizeMethods: (CategoryPortionSizeMethodCreationAttributes & {
    parameters: CategoryPortionSizeMethodParameterCreationAttributes[];
  })[];
};

export type CategoryListEntry = {
  id: string;
  code: string;
  localeId: string;
  name: string;
  englishName: string;
  isHidden: boolean;
};

export type CategoriesResponse = Pagination<CategoryListEntry>;

export type MainCategoriesResponse = Pagination<CategoryAttributes>;

export type RootCategoriesResponse = CategoryListEntry[];

export type CategoryContentsResponse = {
  categories: CategoryListEntry[];
  foods: FoodListEntry[];
};

export type CategoryEntry = CategoryAttributes & {
  attributes?: CategoryAttributeAttributes;
  parentCategories?: CategoryAttributes[];
};

export interface CategoryLocalEntry extends CategoryLocalAttributes {
  main?: CategoryEntry;
}
