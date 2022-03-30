import { FoodHeader } from '@intake24/common/types/http';

export interface CategoryHeader {
  code: string;
  description: string;
}

export interface CategoryContents {
  foods: FoodHeader[];
  categories: CategoryHeader[];
}
