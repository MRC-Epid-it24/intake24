import { UserPortionSizeMethod } from '@common/types/http/foods/user-food-data';
import {
  CategoryLocal,
  CategoryPortionSizeMethod,
  CategoryPortionSizeMethodParameter,
  FoodLocal,
  FoodPortionSizeMethod,
  FoodPortionSizeMethodParameter,
} from '@api/db/models/foods';
import {
  getCategoryParentCategories,
  getFoodParentCategories,
  getParentLocale,
} from '@api/services/foods/common';

import {
  toUserCategoryPortionSizeMethod,
  toUserPortionSizeMethod,
} from './types/portion-size-method-utils';

export interface PortionSizeMethodsService {
  resolvePortionSizeMethods(localeId: string, foodCode: string): Promise<UserPortionSizeMethod[]>;
}

export default (): PortionSizeMethodsService => {
  /**
   *
   * Get Portion Size Methods and their Parameters associated with the supplied category and locale.
   *
   * @param {string} localeId
   * @param {string} categoryCode
   */
  const getCategoryPortionSizeMethods = async (
    localeId: string,
    categoryCode: string
  ): Promise<UserPortionSizeMethod[]> => {
    const categoryPortionMethods = await CategoryPortionSizeMethod.findAll({
      attributes: ['method', 'description', 'imageUrl', 'useForRecipes', 'conversionFactor'],
      order: [['id', 'ASC']],
      include: [
        {
          model: CategoryLocal,
          where: { localeId, categoryCode },
        },
        {
          model: CategoryPortionSizeMethodParameter,
          as: 'parameters',
          attributes: ['name', 'value'],
        },
      ],
    });

    return categoryPortionMethods
      ? categoryPortionMethods.map(toUserCategoryPortionSizeMethod)
      : [];
  };

  const getNearestLocalCategoryPortionSizeMethods = async (
    localeId: string,
    categoryCodes: string[]
  ): Promise<UserPortionSizeMethod[]> => {
    for (let i = 0; i < categoryCodes.length; ++i) {
      const methods = await getCategoryPortionSizeMethods(localeId, categoryCodes[i]);

      if (methods.length > 0) return methods;
    }

    const parents = await getCategoryParentCategories(categoryCodes);

    if (parents.length > 0) {
      return getNearestLocalCategoryPortionSizeMethods(localeId, parents);
    }
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
  const getFoodLocal = async (localeId: string, foodCode: string): Promise<FoodLocal | null> => {
    const food = await FoodLocal.findOne({
      where: { localeId, foodCode },
      include: [
        {
          model: FoodPortionSizeMethod,
          as: 'portionSizeMethods',
          attributes: ['method', 'description', 'imageUrl', 'useForRecipes', 'conversionFactor'],
          include: [
            {
              model: FoodPortionSizeMethodParameter,
              as: 'parameters',
              attributes: ['name', 'value'],
            },
          ],
        },
      ],
      order: [[{ model: FoodPortionSizeMethod, as: 'portionSizeMethods' }, 'id', 'ASC']],
    });

    return food;
  };

  const resolvePortionSizeMethods = async (
    localeId: string,
    foodCode: string
  ): Promise<UserPortionSizeMethod[]> => {
    const foodLocal = await getFoodLocal(localeId, foodCode);

    if (foodLocal && foodLocal.portionSizeMethods && foodLocal.portionSizeMethods.length > 0) {
      return foodLocal.portionSizeMethods.map(toUserPortionSizeMethod);
    }
    const parentCategories = await getFoodParentCategories(foodCode);

    if (parentCategories.length > 0) {
      const categoryPortionSizeMethods = await getNearestLocalCategoryPortionSizeMethods(
        localeId,
        parentCategories
      );
      if (categoryPortionSizeMethods.length > 0) return categoryPortionSizeMethods;
    }

    const prototypeLocale = await getParentLocale(localeId);

    return prototypeLocale ? resolvePortionSizeMethods(prototypeLocale.id, foodCode) : [];
  };

  return {
    resolvePortionSizeMethods,
  };
};
