import type { CategoryHeader } from '@intake24/common/types/http';

export interface FoodHeader {
  code: string;
  name: string;
}

export interface FoodSearchResponse {
  foods: FoodHeader[];
  categories: CategoryHeader[];
}
