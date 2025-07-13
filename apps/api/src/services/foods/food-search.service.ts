import foodIndex from '@intake24/api/food-index';
import { localeOptimizer } from '@intake24/api/food-index/locale-config/locale-optimizer';
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
  logger,
  semanticSearchService,
  hybridScorerService,
}: Pick<IoC, 'inheritableAttributesService' | 'foodThumbnailImageService' | 'cache' | 'cacheConfig' | 'logger' | 'semanticSearchService' | 'hybridScorerService'>) {
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
    const optimizedOptions = await localeOptimizer.applySearchOptimizations(localeId, options, logger);
    const queryParameters = applyDefaultSearchQueryParameters(localeId, description, optimizedOptions);

    // Get phonetic search results from worker
    const phoneticResults = await foodIndex.search(queryParameters);

    // Get semantic search and exact match configurations for this locale
    const semanticConfig = await localeOptimizer.getSemanticConfig(localeId);
    const exactMatchConfig = await localeOptimizer.getExactMatchConfig(localeId);
    let finalResults = phoneticResults;

    // Apply semantic search if enabled
    if (semanticConfig?.enabled && semanticSearchService && hybridScorerService) {
      try {
        logger.debug(`Applying semantic search for locale ${localeId}, query: "${description}"`);

        // Perform semantic search
        const semanticResults = await semanticSearchService.semanticSearch({
          query: description,
          localeId,
          maxResults: semanticConfig.maxResults,
          similarityThreshold: semanticConfig.similarityThreshold,
        });

        // Convert phonetic results to hybrid scorer format
        const phoneticForHybrid = phoneticResults.foods.map(food => ({
          key: food.code,
          phrase: food.name,
          quality: 1.0, // Normalized quality score
          semanticScore: 0,
          hybridScore: 0,
          matchMethod: 'phonetic' as const,
        }));

        // Apply hybrid scoring with category boosting and exact match prioritization
        const hybridResults = hybridScorerService.scoreHybridResults(
          phoneticForHybrid,
          semanticResults,
          semanticConfig,
          {
            applyBoost: true,
            searchQuery: description,
            applyCategoryBoost: true,
            exactMatchConfig: exactMatchConfig || undefined,
          },
        );

        // Convert hybrid results back to food headers
        const enhancedFoods = hybridResults.slice(0, phoneticResults.foods.length).map((result) => {
          const originalFood = phoneticResults.foods.find(f => f.code === result.key);
          return originalFood || { code: result.key, name: result.phrase };
        });

        finalResults = {
          foods: enhancedFoods,
          categories: phoneticResults.categories,
        };

        logger.debug(`Semantic search enhanced results: ${enhancedFoods.length} foods`);
      }
      catch (error) {
        logger.error(`Semantic search failed for locale ${localeId}:`, error);
        // Fall back to phonetic results
        finalResults = phoneticResults;
      }
    }

    const attrs = await getInheritableAttributes(finalResults.foods.map(r => r.code));
    const thumbnailImages = await foodThumbnailImageService.resolveImages(localeId, finalResults.foods.map(foodHeader => foodHeader.code));

    const withFilteredIngredients = {
      foods: finalResults.foods.filter(header =>
        acceptForQuery(isRecipe, attrs[header.code]?.useInRecipes),
      ).map(header => ({
        ...header,
        thumbnailImageUrl: thumbnailImages[header.code],
      })),
      categories: finalResults.categories,
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
