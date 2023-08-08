export interface FoodHeader {
  code: string;
  name: string;
}

export interface FoodSearchResponse {
  foods: FoodHeader[];
}
