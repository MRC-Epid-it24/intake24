export interface FoodHeader {
  code: string;
  name: string;
}

export interface CategoryHeader {
  code: string;
  name: string;
}

export interface FoodSearchResponse {
  foods: FoodHeader[];
  categories: CategoryHeader[];
}
