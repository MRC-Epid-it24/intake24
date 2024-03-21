import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods/user-food-data';
import type { FoodPortionSizeMethod } from '@intake24/db';
import {
  getCategoryParentCategories,
  getFoodParentCategories,
  getParentLocale,
} from '@intake24/api/services/foods/common';
import { CategoryPortionSizeMethod, FoodLocal } from '@intake24/db';

const portionSizeMethodsService = () => {
  /**
   *
   * Get Portion Size Methods and their Parameters associated with the supplied category and locale.
   *
   * @param {string} localeId
   * @param {string} categoryCode
   */
  const getCategoryPortionSizeMethods = async (localeId: string, categoryCode: string) =>
    CategoryPortionSizeMethod.findAll({
      attributes: [
        'method',
        'description',
        'imageUrl',
        'useForRecipes',
        'conversionFactor',
        'orderBy',
        'parameters',
      ],
      order: [['orderBy', 'ASC']],
      include: [{ association: 'categoryLocal', where: { localeId, categoryCode } }],
    });

  const getNearestLocalCategoryPortionSizeMethods = async (
    localeId: string,
    categoryCodes: string[]
  ): Promise<CategoryPortionSizeMethod[]> => {
    for (let i = 0; i < categoryCodes.length; ++i) {
      const methods = await getCategoryPortionSizeMethods(localeId, categoryCodes[i]);

      if (methods.length) return methods;
    }

    const parents = await getCategoryParentCategories(categoryCodes);

    if (parents.length) return getNearestLocalCategoryPortionSizeMethods(localeId, parents);

    return [];
  };

  /**
   *
   * Get local food data record
   *
   * @param {string} localeId
   * @param {string} foodCode
   * @returns {Promise<FoodLocal>}
   */
  const getFoodLocal = async (localeId: string, foodCode: string): Promise<FoodLocal | null> =>
    FoodLocal.findOne({
      where: { localeId, foodCode },
      include: [
        {
          association: 'portionSizeMethods',
          attributes: [
            'method',
            'description',
            'imageUrl',
            'useForRecipes',
            'conversionFactor',
            'orderBy',
            'parameters',
          ],
          separate: true,
          order: [['orderBy', 'ASC']],
        },
      ],
    });

  const resolvePortionSizeMethods = async (
    localeId: string,
    foodCode: string
  ): Promise<(CategoryPortionSizeMethod | FoodPortionSizeMethod)[]> => {
    const foodLocal = await getFoodLocal(localeId, foodCode);
    if (foodLocal?.portionSizeMethods?.length) return foodLocal.portionSizeMethods;

    const parentCategories = await getFoodParentCategories(foodCode);

    if (parentCategories.length) {
      const categoryPortionSizeMethods = await getNearestLocalCategoryPortionSizeMethods(
        localeId,
        parentCategories
      );
      if (categoryPortionSizeMethods.length) return categoryPortionSizeMethods;
    }

    const prototypeLocale = await getParentLocale(localeId);

    return prototypeLocale ? resolvePortionSizeMethods(prototypeLocale.id, foodCode) : [];
  };

  const resolveUserPortionSizeMethods = async (
    localeId: string,
    foodCode: string
  ): Promise<UserPortionSizeMethod[]> => await resolvePortionSizeMethods(localeId, foodCode);

  return {
    resolvePortionSizeMethods,
    resolveUserPortionSizeMethods,
  };
};

export default portionSizeMethodsService;

export type PortionSizeMethodsService = ReturnType<typeof portionSizeMethodsService>;
