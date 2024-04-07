import { initServer } from '@ts-rest/express';

import foodIndex from '@intake24/api/food-index';
import { InvalidIdError } from '@intake24/api/services';
import { contract } from '@intake24/common/contracts';

import { NotFoundError } from '../errors';

// const ATTR_USE_ANYWHERE = 0;
const ATTR_AS_REGULAR_FOOD_ONLY = 1;
const ATTR_AS_RECIPE_INGREDIENT_ONLY = 2;

export function food() {
  function acceptForQuery(recipe: boolean, attrOpt?: number): boolean {
    const attr = attrOpt ?? ATTR_AS_REGULAR_FOOD_ONLY;

    switch (attr) {
      case ATTR_AS_REGULAR_FOOD_ONLY:
        return !recipe;
      case ATTR_AS_RECIPE_INGREDIENT_ONLY:
        return recipe;
      default:
        return true;
    }
  }

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
      const { description, matchScoreWeight, rankingAlgorithm, hidden, category } = query;
      const { localeId } = params;
      const results = await foodIndex.search(
        description,
        localeId,
        rankingAlgorithm ?? 'popularity',
        matchScoreWeight ?? 20,
        hidden === 'true',
        category,
      );

      const attrs
        = await req.scope.cradle.cachedInheritableAttributesService.getInheritableAttributes(
          results.foods.map(r => r.code),
        );

      const withFilteredIngredients = {
        foods: results.foods.filter(header =>
          acceptForQuery(req.query.recipe === 'true', attrs[header.code]?.useInRecipes),
        ),
        categories: results.categories,
      };

      return { status: 200, body: withFilteredIngredients };
    },
    recipeFood: async ({ params }) => {
      const { code, localeId } = params;
      // TODO: implement via the food index by adding a new query type and a message handling/switching between message types
      const result = await foodIndex.getRecipeFood(localeId, code);

      return { status: 200, body: result };
    },
  });
}
