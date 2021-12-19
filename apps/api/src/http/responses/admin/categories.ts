/* eslint-disable import/prefer-default-export */
import { CategoryLocal, FoodLocal } from '@api/db/models/foods';
import { InternalServerError } from '@api/http/errors';
import { CategoryContentsResponse } from '@common/types/http/admin';

export const categoryContentsResponse = ({
  categories,
  foods,
}: {
  categories: CategoryLocal[];
  foods: FoodLocal[];
}): CategoryContentsResponse => ({
  categories: categories.map((item) => {
    const { id, categoryCode: code, localeId, name, category } = item;

    if (!category)
      throw new InternalServerError(
        `categoryContentsResponse: 'category' not loaded relationships.`
      );

    const { name: englishName, isHidden } = category;

    return { id, code, localeId, name, englishName, isHidden };
  }),
  foods: foods.map((item) => {
    const { id, foodCode: code, localeId, name, food } = item;

    if (!food)
      throw new InternalServerError(`categoryContentsResponse: 'food' not loaded relationships.`);

    const { name: englishName } = food;

    return { id, code, localeId, name, englishName };
  }),
});
