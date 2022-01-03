import { CategoryLocal, FoodLocal } from '@api/db';
import { InternalServerError } from '@api/http/errors';
import { CategoryContentsResponse, CategoryListEntry } from '@common/types/http/admin';
import { foodsResponse } from './foods';

export const categoryResponse = (category: CategoryLocal): CategoryListEntry => {
  const { id, categoryCode: code, localeId, name, main } = category;

  if (!main)
    throw new InternalServerError(`categoryContentsResponse: 'main' not loaded relationships.`);

  const { name: englishName, isHidden } = main;

  return { id, code, localeId, name, englishName, isHidden };
};

export const categoryContentsResponse = ({
  categories,
  foods,
}: {
  categories: CategoryLocal[];
  foods: FoodLocal[];
}): CategoryContentsResponse => ({
  categories: categories.map(categoryResponse),
  foods: foods.map(foodsResponse),
});
