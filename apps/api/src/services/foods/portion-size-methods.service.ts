import { NotFoundError } from '@intake24/api/http/errors';
import {
  getCategoryParentCategories,
  getFoodParentCategories,
  getParentLocale,
} from '@intake24/api/services/foods/common';
import type { PortionSizeMethod } from '@intake24/common/surveys';
import type { UserPortionSizeMethod } from '@intake24/common/types/http/foods/user-food-data';
import type { FoodPortionSizeMethod } from '@intake24/db';
import {
  AsServedSet,
  CategoryPortionSizeMethod,
  DrinkwareSet,
  FoodLocal,
  GuideImage,
} from '@intake24/db';

function portionSizeMethodsService() {
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
        'useForRecipes',
        'conversionFactor',
        'orderBy',
        'parameters',
      ],
      order: [['orderBy', 'ASC']],
      include: [{ association: 'categoryLocal', attributes: [], where: { localeId, categoryCode } }],
    });

  const getNearestLocalCategoryPortionSizeMethods = async (
    localeId: string,
    categoryCodes: string[],
  ): Promise<CategoryPortionSizeMethod[]> => {
    for (let i = 0; i < categoryCodes.length; ++i) {
      const methods = await getCategoryPortionSizeMethods(localeId, categoryCodes[i]);

      if (methods.length)
        return methods;
    }

    const parents = await getCategoryParentCategories(categoryCodes);

    if (parents.length)
      return getNearestLocalCategoryPortionSizeMethods(localeId, parents);

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
    foodCode: string,
  ): Promise<(CategoryPortionSizeMethod | FoodPortionSizeMethod)[]> => {
    const foodLocal = await getFoodLocal(localeId, foodCode);
    if (foodLocal?.portionSizeMethods?.length)
      return foodLocal.portionSizeMethods;

    const parentCategories = await getFoodParentCategories(foodCode);

    if (parentCategories.length) {
      const categoryPortionSizeMethods = await getNearestLocalCategoryPortionSizeMethods(
        localeId,
        parentCategories,
      );
      if (categoryPortionSizeMethods.length)
        return categoryPortionSizeMethods;
    }

    const prototypeLocale = await getParentLocale(localeId);

    return prototypeLocale ? resolvePortionSizeMethods(prototypeLocale.id, foodCode) : [];
  };

  async function getPortionSizeImageUrl(psm: PortionSizeMethod): Promise<string> {
    switch (psm.method) {
      case 'as-served': {
        const set = await AsServedSet.findByPk(psm.parameters.servingImageSet, {
          attributes: ['id'],
          include: [{ association: 'selectionImage', attributes: ['path'] }],
        });

        if (!set)
          throw new NotFoundError(`As served set ${psm.parameters.servingImageSet} not found`);

        if (!set.selectionImage) {
          throw new NotFoundError(
            `Selection screen image for as served set ${psm.parameters.servingImageSet} is undefined`,
          );
        }

        return set.selectionImage.path;
      }

      case 'guide-image': {
        const guideImage = await GuideImage.findByPk(psm.parameters.guideImageId, {
          attributes: ['id'],
          include: [{ association: 'selectionImage', attributes: ['path'] }],
        });

        if (!guideImage)
          throw new NotFoundError(`Guide image ${psm.parameters.guideImageId} not found`);

        if (!guideImage.selectionImage) {
          throw new NotFoundError(
            `Selection screen image for guide image ${psm.parameters.guideImageId} is undefined`,
          );
        }

        return guideImage.selectionImage.path;
      }

      case 'drink-scale': {
        const set = await DrinkwareSet.findByPk(psm.parameters.drinkwareId, {
          attributes: ['id'],
          include: [
            {
              association: 'imageMap',
              attributes: ['id'],
              include: [{ association: 'baseImage', attributes: ['path'] }],
            },
          ],
        });

        if (!set)
          throw new NotFoundError(`Drinkware set ${psm.parameters.drinkwareId} not found`);

        if (!set.imageMap?.baseImage) {
          throw new NotFoundError(
            `Drink scale image map for drinkware set ${psm.parameters.drinkwareId} is undefined`,
          );
        }

        return set.imageMap.baseImage.path;
      }

      case 'standard-portion':
      case 'milk-in-a-hot-drink':
      case 'parent-food-portion':
      case 'direct-weight':
      case 'recipe-builder':
        return 'portion/standard-portion.jpg';

      case 'pizza':
      case 'pizza-v2':
        return 'portion/pizza.jpg';

      case 'cereal':
      case 'milk-on-cereal':
        return 'portion/cereal.jpg';

      default:
        throw new Error(
          `Unexpected portion size method type: ${(psm as PortionSizeMethod).method}`,
        );
    }
  }

  const resolveUserPortionSizeMethods = async (
    localeId: string,
    foodCode: string,
  ): Promise<UserPortionSizeMethod[]> => {
    const psms = await resolvePortionSizeMethods(localeId, foodCode);

    return Promise.all(
      psms.map(async psm => ({
        ...psm.get(),
        imageUrl: await getPortionSizeImageUrl(psm as PortionSizeMethod),
      })),
    );
  };

  return {
    getPortionSizeImageUrl,
    resolvePortionSizeMethods,
    resolveUserPortionSizeMethods,
  };
}

export default portionSizeMethodsService;

export type PortionSizeMethodsService = ReturnType<typeof portionSizeMethodsService>;
