import foodIndex from '@intake24/api/food-index';
import { applyDefaultSearchQueryParameters } from '@intake24/api/food-index/search-query';
import type { OptionalSearchQueryParameters } from '@intake24/api/food-index/search-query';
import type { IoC } from '@intake24/api/ioc';
import type { InheritableAttributes } from '@intake24/api/services/foods/types/inheritable-attributes';
import type { FoodSearchResponse } from '@intake24/common/types/http';

// const ATTR_USE_ANYWHERE = 0;
const ATTR_AS_REGULAR_FOOD_ONLY = 1;
const ATTR_AS_RECIPE_INGREDIENT_ONLY = 2;

function foodSearchService({
  inheritableAttributesService,
  foodThumbnailImageService,
  cache,
  cacheConfig,
}: Pick<IoC, 'inheritableAttributesService' | 'foodThumbnailImageService' | 'cache' | 'cacheConfig'>) {
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

  const resolveInheritableAttributes = async (foodCodes: string[]): Promise<Record<string, InheritableAttributes>> => {
    const data = await Promise.all(
      foodCodes.map(code => inheritableAttributesService.resolveInheritableAttributes(code)),
    );

    return Object.fromEntries(foodCodes.map((code, index) => [code, data[index]]));
  };

  const getInheritableAttributes = async (foodCodes: string[]): Promise<Record<string, InheritableAttributes | null>> => {
    return cache.rememberMany(foodCodes, 'food-attributes', cacheConfig.ttl, resolveInheritableAttributes);
  };

  const search = async (localeId: string, description: string, isRecipe: boolean, options: OptionalSearchQueryParameters): Promise<FoodSearchResponse> => {
    const queryParameters = applyDefaultSearchQueryParameters(localeId, description, options);
    const results = await foodIndex.search(queryParameters);
    const attrs = await getInheritableAttributes(results.foods.map(r => r.code));
    const thumbnailImages = await foodThumbnailImageService.resolveImages(localeId, results.foods.map(foodHeader => foodHeader.code));

    const withFilteredIngredients = {
      foods: results.foods.filter(header =>
        acceptForQuery(isRecipe, attrs[header.code]?.useInRecipes),
      ).map(header => ({
        ...header,
        thumbnailImageUrl: thumbnailImages[header.code],
      })),
      categories: results.categories,
    };

    return withFilteredIngredients;
  };

  return {
    getInheritableAttributes,
    search,
  };
}

export default foodSearchService;

export type FoodSearchService = ReturnType<
  typeof foodSearchService
>;
