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
    const { id, categoryCode: code, localeId, name, main } = item;

    if (!main)
      throw new InternalServerError(`categoryContentsResponse: 'main' not loaded relationships.`);

    const { name: englishName, isHidden } = main;

    return { id, code, localeId, name, englishName, isHidden };
  }),
  foods: foods.map((item) => {
    const { id, foodCode: code, localeId, name, main } = item;

    if (!main)
      throw new InternalServerError(`categoryContentsResponse: 'main' not loaded relationships.`);

    const { name: englishName } = main;

    return { id, code, localeId, name, englishName };
  }),
});
