import { initServer } from '@ts-rest/express';

import foodIndex from '@intake24/api/food-index';
import type { OptionalSearchQueryParameters } from '@intake24/api/food-index/search-query';
import { InvalidIdError } from '@intake24/api/services';
import { contract } from '@intake24/common/contracts';

import { NotFoundError } from '../errors';

export function food() {
  return initServer().router(contract.food, {
    entry: async ({ params, req }) => {
      const { code, localeId } = params;
      const { imagesBaseUrl } = req.scope.cradle;

      try {
        const response = await req.scope.cradle.cache.remember(
          `food-entry:${localeId}:${code}`,
          req.scope.cradle.cacheConfig.ttl,
          async () => {
            const data = await req.scope.cradle.foodDataService.getFoodData(localeId, code);

            for (let i = 0; i < data.portionSizeMethods.length; ++i) {
              data.portionSizeMethods[i].imageUrl
                = `${imagesBaseUrl}/${data.portionSizeMethods[i].imageUrl}`;
            }

            return data;
          },
        );

        return { status: 200, body: response };
      }
      catch (err) {
        if (err instanceof InvalidIdError)
          throw new NotFoundError(err.message);
        throw err;
      }
    },
    categories: async ({ params, req }) => {
      const { code } = params;
      const categories
        = await req.scope.cradle.cachedParentCategoriesService.getFoodAllCategories(code);

      return { status: 200, body: categories };
    },
    search: async ({ params, query, req }) => {
      const { description, matchScoreWeight, rankingAlgorithm, hidden, category: limitToCategory, limit, previous, recipe } = query;
      const { localeId } = params;

      const searchOptions: OptionalSearchQueryParameters = {
        previous,
        limit,
        includeHidden: hidden === 'true',
        rankingAlgorithm,
        matchScoreWeight,
        limitToCategory,
      };

      const searchResults = await req.scope.cradle.foodSearchService.search(localeId, description, recipe === 'true', searchOptions);

      return { status: 200, body: searchResults };
    },
    recipeFood: async ({ params }) => {
      const { code, localeId } = params;
      // TODO: implement via the food index by adding a new query type and a message handling/switching between message types
      const result = await foodIndex.getRecipeFood(localeId, code);

      return { status: 200, body: result };
    },
  });
}
