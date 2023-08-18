import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { SearchSortingAlgorithm } from '@intake24/common/surveys';
import type { FoodSearchResponse } from '@intake24/common/types/http';
import foodIndex from '@intake24/api/food-index';

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
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ATTR_USE_ANYWHERE = 0;
const ATTR_AS_REGULAR_FOOD_ONLY = 1;
const ATTR_AS_RECIPE_INGREDIENT_ONLY = 2;

const foodSearchController = ({
  cachedInheritableAttributesService,
  cachedParentCategoriesService,
}: Pick<IoC, 'cachedInheritableAttributesService' | 'cachedParentCategoriesService'>) => {
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

  async function filterByCategory(
    categoryCode: string,
    items: FoodSearchResponse
  ): Promise<FoodSearchResponse> {
    const foodCategories = await Promise.all(
      items.foods.map((header) => cachedParentCategoriesService.getFoodAllCategories(header.code))
    );
    const categoryCategories = await Promise.all(
      items.categories.map((header) =>
        cachedParentCategoriesService.getCategoryAllCategories(header.code)
      )
    );

    return {
      foods: items.foods.filter((_, index) => {
        return foodCategories[index].includes(categoryCode);
      }),
      categories: items.categories.filter((_, index) => {
        return categoryCategories[index].includes(categoryCode);
      }),
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
      parseFloat(req.query.matchScoreWeight ?? '20')
    );

    const withFilteredIngredients = await filterRecipeIngredients(
      req.query.recipe === 'true',
      results
    );

    // Not the best way to filter by category because some potential matches
    // will be dropped due to the limit on the number of returned matches.
    //
    // The category filter should be applied before the limit, but that requires changes
    // to the food index implementation, not sure if that is worth it.
    if (req.query.category !== undefined) {
      const filteredByCategory = await filterByCategory(
        req.query.category,
        withFilteredIngredients
      );

      res.json(filteredByCategory);
      return;
    }

    res.json(withFilteredIngredients);
  };

  const recipe = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    res.json();
  };

  const category = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    const { code } = req.query;

    res.json();
  };

  const splitDescription = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    res.json();
  };

  return {
    search,
    recipe,
    category,
    splitDescription,
  };
};

export default foodSearchController;

export type FoodSearchController = ReturnType<typeof foodSearchController>;
