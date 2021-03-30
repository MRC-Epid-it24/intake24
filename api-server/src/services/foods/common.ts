import { CategoryCategory, FoodCategory, Locale } from '@/db/models/foods';
import InvalidArgumentError from '@/services/foods/invalid-argument-error';

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
 * @returns {Promise<Locale | null>}
 */
export async function getParentLocale(localeId: string): Promise<Locale | null> {
  const locale = await Locale.findOne({
    where: { id: localeId },
    include: [{ model: Locale, as: 'parent' }],
  });

  if (locale == null) throw new InvalidArgumentError(`Invalid locale ID: ${localeId}`);

  return locale.parent ?? null;
}
