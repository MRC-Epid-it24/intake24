import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { SearchSortingAlgorithm } from '@intake24/common/surveys';
import type { FoodSearchResponse } from '@intake24/common/types/http';
import foodIndex from '@intake24/api/food-index';
import { logger } from '@intake24/common-backend/services';

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
}: Pick<IoC, 'cachedInheritableAttributesService'>) => {
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

  const recipe = async (req: Request, res: Response): Promise<void> => {
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
  };

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
    res.json();
  };

  return {
    search,
    recipe,
    category,
    splitDescription,
    recipeFood,
  };
};

export default foodSearchController;

export type FoodSearchController = ReturnType<typeof foodSearchController>;
