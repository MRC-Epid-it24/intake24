import type {
  CategoryContentsResponse,
  CategoryListEntry,
} from '@intake24/common/types/http/admin';
import type { CategoryLocal, FoodLocal } from '@intake24/db';
import { InternalServerError } from '@intake24/api/http/errors';

import { foodsResponse } from './foods';

export function categoryResponse(category: CategoryLocal): CategoryListEntry {
  const { id, categoryCode: code, localeId, name, main } = category;

  if (!main)
    throw new InternalServerError(`categoryContentsResponse: 'main' not loaded relationships.`);

  const { name: englishName, isHidden } = main;

  return { id, code, localeId, name, englishName, isHidden };
}

export function categoryContentsResponse({
  categories,
  foods,
}: {
  categories: CategoryLocal[];
  foods: FoodLocal[];
}): CategoryContentsResponse {
  return {
    categories: categories.map(categoryResponse),
    foods: foods.map(foodsResponse),
  };
}
