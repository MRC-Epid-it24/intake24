import type { RecipeFood } from '@intake24/common/types';
import type { FoodSearchResponse, UserFoodData } from '@intake24/common/types/http';

import http from './http.service';

export type SearchOptions = {
  recipe?: boolean;
  hidden?: boolean;
  category?: string;
};

export default {
  search: async (
    surveySlug: string,
    description: string,
    options: SearchOptions = {},
  ): Promise<FoodSearchResponse> => {
    const { data } = await http.get<FoodSearchResponse>(`surveys/${surveySlug}/search`, {
      params: { description, ...options },
    });
    return data;
  },

  getData: async (localeId: string, foodCode: string): Promise<UserFoodData> => {
    const { data } = await http.get<UserFoodData>(`foods/${localeId}/${foodCode}`);
    return data;
  },

  getRecipeFood: async (localeId: string, code: string): Promise<RecipeFood> => {
    const { data } = await http.get<RecipeFood>(`foods/${localeId}/${code}/recipe-food`);
    return data;
  },
};
