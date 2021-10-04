export interface FoodHeader {
  code: string;
  description: string;
}

export interface FoodSearchResponse {
  foods: FoodHeader[];
}
