import { CategoryAttributes, CategoryLocalAttributes, Pagination } from '../../models';
import { FoodListEntry } from './foods';

export type CategoryListEntry = {
  id: string;
  code: string;
  localeId: string;
  name: string;
  englishName: string;
  isHidden: boolean;
};

export type CategoriesResponse = Pagination<CategoryLocalAttributes>;

export type RootCategoriesResponse = CategoryListEntry[];

export type CategoryContentsResponse = {
  categories: CategoryListEntry[];
  foods: FoodListEntry[];
};

export interface CategoryEntry extends CategoryLocalAttributes {
  main?: CategoryAttributes;
}
