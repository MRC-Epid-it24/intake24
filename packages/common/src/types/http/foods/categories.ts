import type { FoodHeader } from '@intake24/common/types/http';

export interface CategoryHeader {
  code: string;
  description: string;
}

export interface CategoryContents {
  header: CategoryHeader;
  foods: FoodHeader[];
  subcategories: CategoryHeader[];
}
