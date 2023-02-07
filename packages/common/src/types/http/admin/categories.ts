import type {
  Attributes,
  CategoryAssociations,
  CategoryAttributes,
  CategoryLocalAttributes,
  CategoryPortionSizeMethodUpdateAttributes,
  Pagination,
} from '../../models';
import type { FoodListEntry } from './foods';

export type CategoryInput = {
  name: string;
  main: {
    code: string;
    name: string;
    isHidden: boolean;
    attributes: Attributes;
    parentCategories: Pick<CategoryAttributes, 'code' | 'name'>[];
  };
  portionSizeMethods: CategoryPortionSizeMethodUpdateAttributes[];
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

export type CategoryEntry = CategoryAttributes &
  Pick<CategoryAssociations, 'attributes' | 'parentCategories'>;

export interface CategoryLocalEntry extends CategoryLocalAttributes {
  main?: CategoryEntry;
}
