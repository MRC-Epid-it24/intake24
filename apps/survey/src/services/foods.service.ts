import type { FoodSearchResponse, UserFoodData } from '@intake24/common/types/http';
import type { SearchSortingAlgorithm } from '@intake24/common/types/models';

import http from './http.service';

export default {
  search: async (
    localeId: string,
    description: string,
    rankingAlgorithm: SearchSortingAlgorithm | undefined,
    matchScoreWeight: number | undefined
  ): Promise<FoodSearchResponse> => {
    const { data } = await http.get<FoodSearchResponse>(
      `foods/${localeId}?description=${description}&rankingAlgorithm=${rankingAlgorithm}&matchScoreWeight=${matchScoreWeight}`
    );
    return data;
  },

  getData: async (localeId: string, foodCode: string): Promise<UserFoodData> => {
    const { data } = await http.get<UserFoodData>(`foods/${localeId}/${foodCode}`);
    return data;
  },
};
