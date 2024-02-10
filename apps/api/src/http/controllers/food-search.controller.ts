import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { SearchSortingAlgorithm } from '@intake24/common/surveys';
import type { FoodSearchResponse } from '@intake24/common/types/http';
import foodIndex from '@intake24/api/food-index';
import { RedisSubscriber } from '@intake24/api/services';

interface SearchParams {
  localeId: string;
}

interface SearchQuery {
  description: string;
  previous: string[];
  limit?: string;
  rankingAlgorithm?: SearchSortingAlgorithm;
  matchScoreWeight?: string;
  recipe?: string;
  category?: string;
  hidden?: string;
}

interface RecipeFoodQuery {
  code: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ATTR_USE_ANYWHERE = 0;
const ATTR_AS_REGULAR_FOOD_ONLY = 1;
const ATTR_AS_RECIPE_INGREDIENT_ONLY = 2;

const foodSearchController = ({
  cachedInheritableAttributesService,
  subscriberConfig,
  logger,
}: Pick<IoC, 'cachedInheritableAttributesService' | 'subscriberConfig' | 'logger'>) => {
  const redisSubscriber = new RedisSubscriber({ subscriberConfig, logger });
  redisSubscriber.subscribeToChannel();
  redisSubscriber.onMessageReceive = async (message): Promise<string[]> => {
    const localeIds = JSON.parse(message);
    if (localeIds.length > 0) {
      await foodIndex.rebuildSpecificLocales(localeIds);
    }
    return localeIds;
  };

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

  async function filterRecipeIngredients(
    recipe: boolean,
    items: FoodSearchResponse
  ): Promise<FoodSearchResponse> {
    const attrs = await cachedInheritableAttributesService.getInheritableAttributes(
      items.foods.map((r) => r.code)
    );

    return {
      foods: items.foods.filter((header) =>
        acceptForQuery(recipe, attrs[header.code]?.useInRecipes)
      ),
      categories: items.categories,
    };
  }

  // API endpoint for rebuilding the food index
  const rebuildFoodIndex = async (req: Request, res: Response): Promise<void> => {
    logger.debug(`\n\n\nRebuilding ${JSON.stringify(req.body)} food index\n\n\n`);
    if (!req.body || !req.body.locales) {
      await foodIndex.rebuild();
    } else {
      await foodIndex.rebuildSpecificLocales(req.body.locales);
    }
    res.json({ success: true });
  };

  // REDIS JOB endpoint for rebuilding the food index
  const rebuildFoodIndexJob = async (locales?: string[]): Promise<void> => {
    if (locales && locales.length > 0) {
      await foodIndex.rebuildSpecificLocales(locales);
    } else {
      await foodIndex.rebuild();
    }
  };

  const search = async (
    req: Request<SearchParams, unknown, unknown, SearchQuery>,
    res: Response
  ): Promise<void> => {
    const results = await foodIndex.search(
      req.query.description,
      req.params.localeId,
      req.query.rankingAlgorithm ?? 'popularity',
      parseFloat(req.query.matchScoreWeight ?? '20'),
      req.query.hidden === 'true',
      req.query.category
    );

    const withFilteredIngredients = await filterRecipeIngredients(
      req.query.recipe === 'true',
      results
    );

    res.json(withFilteredIngredients);
  };

  /* const recipe = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    res.json();
  };

  const category = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    const { code } = req.query;
  };

  const splitDescription = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    const { code } = req.query;
    res.json();
  }; */

  const recipeFood = async (
    req: Request<SearchParams, unknown, unknown, RecipeFoodQuery>,
    res: Response
  ): Promise<void> => {
    const { localeId } = req.params;
    const { code } = req.query;
    // TODO: implement via the food index by adding a new query type and a message handling/switching between message types
    const result = await foodIndex.getRecipeFood(localeId, code);

    logger.debug('Recipe food result', JSON.stringify(result.steps));
    res.json(result);
  };

  return {
    search,
    recipeFood,
    rebuildFoodIndex,
    rebuildFoodIndexJob,
  };
};

export default foodSearchController;

export type FoodSearchController = ReturnType<typeof foodSearchController>;
