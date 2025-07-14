import { IoC } from '@intake24/api/ioc';
import InvalidIdError from '@intake24/api/services/foods/invalid-id-error';
import type {
  UserAssociatedFoodPrompt,
  UserFoodData,
} from '@intake24/common/types/http/foods/user-food-data';

import {
  AssociatedFood,
  Brand,
  Category,
  Food,
} from '@intake24/db';
import PortionSizeMethodsImpl from './portion-size-methods.service';

// const for KCAL Nutrient
const KCAL_NUTRIENT_TYPE_ID = 1;

function foodDataService({ imagesBaseUrl, cachedParentCategoriesService }: Pick<IoC, 'imagesBaseUrl' | 'cachedParentCategoriesService'>) {
  const portionSizeMethodsImpl = PortionSizeMethodsImpl(imagesBaseUrl);

  const getNutrientKCalPer100G = async (localeId: string, code: string): Promise<number> => {
    const foodNutrientData = await Food.findOne({
      where: { code, localeId },
      attributes: [],
      include: [
        {
          association: 'nutrientRecords',
          attributes: ['id'], // these attributes should be empty, but sequelize crashes if that is the case
          through: { attributes: [] },
          duplicating: true,
          include: [
            {
              association: 'nutrients',
              where: { nutrientTypeId: KCAL_NUTRIENT_TYPE_ID },
              attributes: ['unitsPer100g'],
            },
          ],
        },
      ],
    });

    if (!foodNutrientData) {
      throw new InvalidIdError(
        `Either locale id '${localeId}' or food code '${code}' is `
        + 'invalid, food isn\'t linked to a nutrient table record, or the energy (kcal) nutrient '
        + 'data is missing',
      );
    }

    return foodNutrientData.nutrientRecords?.map((el) => {
      return el.nutrients?.at(0)?.unitsPer100g ?? 0;
    }).at(0) ?? 0;
  };

  /**
   *
   * Get all associated Foods that link to this locale and Food Code
   *
   * @param {string} foodId
   * @returns {Promise<AssociatedFoodsResponse[]>}
   */
  const getAssociatedFoodPrompts = async (foodId: string): Promise<UserAssociatedFoodPrompt[]> => {
    const associatedFoods = await AssociatedFood.findAll({
      where: { id: foodId },
      attributes: [
        'associatedFoodCode',
        'associatedCategoryCode',
        'text',
        'linkAsMain',
        'genericName',
        'multiple',
      ],
      order: [['orderBy', 'ASC']],
    });

    return associatedFoods.map(row => ({
      foodCode: row.associatedFoodCode ?? undefined,
      categoryCode: row.associatedCategoryCode ?? undefined,
      promptText: row.text,
      linkAsMain: row.linkAsMain,
      genericName: row.genericName,
      multiple: row.multiple,
    }));
  };

  /**
   *
   * Get food brands based on the code of the food and localeId
   *
   * @param {string} foodId
   * @returns {Promise<string[]>}
   */
  const getBrands = async (foodId: string): Promise<string[]> => {
    const brands = await Brand.findAll({ where: { id: foodId }, attributes: ['name'] });

    return brands.length ? brands.map(brand => brand.name) : [];
  };

  const getAllTags = async (code: string[], foodTags: string[] = []) => {
    const categories = await Category.findAll({ where: { code }, attributes: ['tags'] });

    return [...new Set(categories.reduce((acc, { tags }) => acc.concat(tags), foodTags))];
  };

  const getFoodData = async (localeCode: string, code: string): Promise<UserFoodData> => {
    const food = await Food.findOne({ where: { code, localeId: localeCode } });
    if (!food)
      throw new InvalidIdError(`Invalid food, locale code: ${localeCode}, food code: ${code}`);

    const { id } = food;
    const categories = await cachedParentCategoriesService.getFoodAllCategoryCodes(localeCode, code);

    const [
      associatedFoodPrompts,
      brandNames,
      kcalPer100g,
      portionSizeMethods,
      tags,
    ] = await Promise.all([
      getAssociatedFoodPrompts(id),
      getBrands(id),
      getNutrientKCalPer100G(localeCode, code),
      portionSizeMethodsImpl.resolveUserPortionSizeMethods(localeCode, code),
      getAllTags(categories, food.tags),
    ]);

    return {
      id,
      associatedFoodPrompts,
      brandNames,
      code,
      englishName: food.englishName,
      groupCode: food.foodGroupId,
      kcalPer100g,
      localName: food.name,
      portionSizeMethods,
      categories,
      tags,
    };
  };

  return {
    getNutrientKCalPer100G,
    getFoodData,
  };
}

export default foodDataService;

export type FoodDataService = ReturnType<typeof foodDataService>;
