import { FoodSearchResponse, UserFoodData } from '@common/types/http';
import http from './http.service';

export default {
  search: async (localeId: string, description: string): Promise<FoodSearchResponse> => {
    const response = await http.get<FoodSearchResponse>(
      `foods/${localeId}?description=${description}`
    );
    return response.data;
  },

  getData: async (localeId: string, foodCode: string): Promise<UserFoodData> => {
    const response = await http.get<UserFoodData>(`foods/${localeId}/${foodCode}`);
    return response.data;
  },
};
