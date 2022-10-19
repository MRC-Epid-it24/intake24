import type { FoodSearchResponse, UserFoodData } from '@intake24/common/types/http';
import type { SearchSortingAlgorithm } from '@intake24/common/types/models';

import http from './http.service';

export type SearchOptions = {
  rankingAlgorithm?: SearchSortingAlgorithm;
  matchScoreWeight?: number;
  recipe?: boolean;
};

export default {
  search: async (
    localeId: string,
    description: string,
    options: SearchOptions = {}
  ): Promise<FoodSearchResponse> => {
    const { data } = await http.get<FoodSearchResponse>(`foods/${localeId}`, {
      params: { description, ...options },
    });
    return data;
  },

  getData: async (localeId: string, foodCode: string): Promise<UserFoodData> => {
    const { data } = await http.get<UserFoodData>(`foods/${localeId}/${foodCode}`);
    return data;
  },
};
