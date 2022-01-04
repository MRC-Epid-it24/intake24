import { CategoryCategory, FoodCategory, FoodsLocale } from '@intake24/db';
import InvalidIdError from '@api/services/foods/invalid-id-error';

export async function getFoodParentCategories(foodCode: string): Promise<string[]> {
  const categories = await FoodCategory.findAll({
    where: { foodCode },
    attributes: ['categoryCode'],
    order: [['categoryCode', 'ASC']],
  });

  return categories.map((row) => row.categoryCode);
}

export async function getCategoryParentCategories(categoryCodes: string[]): Promise<string[]> {
  const categories = await CategoryCategory.findAll({
    where: { subcategoryCode: categoryCodes },
    attributes: ['categoryCode'],
    order: [['categoryCode', 'ASC']],
  });

  return categories.map((row) => row.categoryCode);
}

/**
 *
 *  Get parent locale for the given locale
 *
 * @param {string} localeId Get Prototype locale of the supplied locale
 * @returns {Promise<FoodsLocale | null>}
 */
export async function getParentLocale(localeId: string): Promise<FoodsLocale | null> {
  const locale = await FoodsLocale.findOne({
    where: { id: localeId },
    include: [{ model: FoodsLocale, as: 'parent' }],
  });

  if (locale == null) throw new InvalidIdError(`Invalid locale ID: ${localeId}`);

  return locale.parent ?? null;
}
