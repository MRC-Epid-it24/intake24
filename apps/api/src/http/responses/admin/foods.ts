import { InternalServerError } from '@intake24/api/http/errors';
import type { FoodListEntry } from '@intake24/common/types/http/admin';
import type { FoodLocal } from '@intake24/db';

export function foodsResponse(food: FoodLocal): FoodListEntry {
  const { id, foodCode: code, localeId, name, main } = food;

  if (!main)
    throw new InternalServerError(`categoryContentsResponse: 'main' not loaded relationships.`);

  const { name: englishName } = main;

  return { id, code, localeId, name, englishName };
}
