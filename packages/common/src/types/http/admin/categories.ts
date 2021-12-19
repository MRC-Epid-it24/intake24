import { Dictionary } from '@common/types';
import { CategoryLocalAttributes, Pagination } from '../../models';

export type CategoryListEntry = {
  id: string;
  code: string;
  localeId: string;
  name: string;
  englishName: string;
  isHidden: boolean;
};

export type FoodListEntry = {
  id: string;
  code: string;
  localeId: string;
  name: string;
  englishName: string;
};

export type CategoriesResponse = Pagination<CategoryListEntry>;

export type RootCategoriesResponse = CategoryListEntry[];

export type CategoryContentsResponse = {
  categories: CategoryListEntry[];
  foods: FoodListEntry[];
};

export type CategoryEntry = CategoryLocalAttributes;

export type CategoryRefs = Dictionary;

export type CategoryResponse = {
  data: CategoryEntry;
  refs: CategoryRefs;
};

export type CreateCategoryResponse = Pick<CategoryResponse, 'refs'>;

export type StoreCategoryResponse = Pick<CategoryResponse, 'data'>;
