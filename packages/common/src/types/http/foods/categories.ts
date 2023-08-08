import type { FoodHeader } from '@intake24/common/types/http';
import type { Pagination } from '@intake24/db';

export interface CategoryHeader {
  code: string;
  name: string;
}

export interface CategoryContents {
  header: CategoryHeader;
  foods: FoodHeader[];
  subcategories: CategoryHeader[];
}

export type CategorySearch = Pagination<FoodHeader>;
