import { FoodSearchResponse, UserFoodData } from '@intake24/common/types/http';
import http from './http.service';

export default {
  search: async (localeId: string, description: string): Promise<FoodSearchResponse> => {
    const { data } = await http.get<FoodSearchResponse>(
      `foods/${localeId}?description=${description}`
    );
    return data;
  },

  getData: async (localeId: string, foodCode: string): Promise<UserFoodData> => {
    const { data } = await http.get<UserFoodData>(`foods/${localeId}/${foodCode}`);
    return data;
  },
};
