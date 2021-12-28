/* eslint-disable import/prefer-default-export */
import { FoodLocal } from '@api/db/models/foods';
import { InternalServerError } from '@api/http/errors';
import { FoodListEntry } from '@common/types/http/admin';

export const foodsResponse = (food: FoodLocal): FoodListEntry => {
  const { id, foodCode: code, localeId, name, main } = food;

  if (!main)
    throw new InternalServerError(`categoryContentsResponse: 'main' not loaded relationships.`);

  const { name: englishName } = main;

  return { id, code, localeId, name, englishName };
};
