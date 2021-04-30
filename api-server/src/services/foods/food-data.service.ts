import {
  AssociatedFood,
  Brand,
  Food,
  FoodLocal,
  FoodLocalList,
  Locale,
  NutrientMapping,
  NutrientTableRecord,
  NutrientTableRecordNutrient,
} from '@/db/models/foods';

import InvalidIdError from '@/services/foods/invalid-id-error';
import { getParentLocale } from '@/services/foods/common';

import { UserAssociatedFoodPrompt, UserFoodData } from '@common/types/http/foods/user-food-data';
import { IoC } from '@/ioc';
import InheritableAttributesImpl from './inheritable-attributes-service';
import PortionSizeMethodsImpl from './portion-size-methods-service';

// const for KCAL Nutrient
const KCAL_NUTRIENT_TYPE_ID = 1;

export interface FoodDataService {
  getNutrientKCalPer100G(localeId: string, foodCode: string): Promise<number>;
  getFoodData(localeId: string, foodCode: string): Promise<UserFoodData>;
}

export default (config: Pick<IoC, 'imagesBaseUrl'>): FoodDataService => {
  const inheritableAttributesImpl = InheritableAttributesImpl();
  const portionSizeMethodsImpl = PortionSizeMethodsImpl(config.imagesBaseUrl);

  const getNutrientKCalPer100G = async (localeId: string, foodCode: string): Promise<number> => {
    const foodNutrientData = await FoodLocal.findOne({
      where: { localeId, foodCode },
      attributes: [],
      include: [
        {
          model: NutrientMapping,
          attributes: ['id'], // these attributes should be empty, but sequelize crashes if that is the case
          include: [
            {
              model: NutrientTableRecord,
              attributes: ['id'], // these attributes should be empty, but sequelize crashes if that is the case
              duplicating: true,
              include: [
                {
                  model: NutrientTableRecordNutrient,
                  where: { nutrientTypeId: KCAL_NUTRIENT_TYPE_ID },
                  attributes: ['unitsPer100g'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (foodNutrientData == null)
      throw new InvalidIdError(
        `Either locale id '${localeId}' or food code '${foodCode}' is ` +
          "invalid, food isn't linked to a nutrient table record, or the energy (kcal) nutrient " +
          'data is missing'
      );

    let kcal = foodNutrientData?.nutrientMappings?.map((el) => {
      return el.nutrientTableRecord?.nutrients
        ? el.nutrientTableRecord?.nutrients[0].unitsPer100g
        : 0;
    })[0];
    kcal = kcal || 0;
    if (!kcal) {
      const parentLocale = await getParentLocale(localeId);
      if (parentLocale && parentLocale.prototypeLocaleId)
        kcal = await getNutrientKCalPer100G(parentLocale.prototypeLocaleId, foodCode);
    }
    return kcal;
  };

  /**
   *
   * Get all associated Foods that link to this locale and Food Code
   *
   * @param {string} localeId
   * @param {string} foodCode
   * @returns {Promise<AssociatedFoodsResponse[]>}
   */
  const getLocalAssociatedFoodPrompts = async (
    localeId: string,
    foodCode: string
  ): Promise<UserAssociatedFoodPrompt[]> => {
    const associatedFoods = await AssociatedFood.findAll({
      where: { localeId, foodCode },
      attributes: [
        'associatedFoodCode',
        'associatedCategoryCode',
        'text',
        'linkAsMain',
        'genericName',
      ],
    });

    return associatedFoods.map((row) => {
      return {
        foodCode: row.associatedFoodCode ?? undefined,
        categoryCode: row.associatedCategoryCode ?? undefined,
        promptText: row.text,
        linkAsMain: row.linkAsMain,
        genericName: row.genericName,
      };
    });
  };

  /**
   *
   * Get food brands based on the code of the food and localeId
   *
   * @param {string} localeId
   * @param {string} foodCode
   * @returns {Promise<string[]>}
   */
  const getBrands = async (localeId: string, foodCode: string): Promise<string[]> => {
    const brands = await Brand.findAll({
      where: { localeId, foodCode },
      attributes: ['name'],
    });

    return brands ? brands.map((brand) => brand.name) : [];
  };

  const resolveAssociatedFoodPrompts = async (
    localeId: string,
    foodCode: string
  ): Promise<UserAssociatedFoodPrompt[]> => {
    const localPrompts = await getLocalAssociatedFoodPrompts(localeId, foodCode);

    if (localPrompts.length > 0) return localPrompts;

    const locale = await Locale.findOne({
      where: { id: localeId },
      include: [{ model: Locale, as: 'parent' }],
    });

    if (!locale) throw new InvalidIdError(`Unknown locale ID: ${localeId}`);

    if (locale.parent && locale.respondentLanguageId === locale.parent.respondentLanguageId) {
      return resolveAssociatedFoodPrompts(locale.parent.id, foodCode);
    }

    return [];
  };

  const getFoodData = async (localeId: string, foodCode: string): Promise<UserFoodData> => {
    const foodRecord = await Food.findOne({ where: { code: foodCode } });

    if (foodRecord == null) throw new InvalidIdError(`Invalid food code: ${foodCode}`);

    const foodListCheck = await FoodLocalList.findOne({
      where: { foodCode, localeId },
      attributes: ['food_code'],
    });

    if (foodListCheck == null)
      throw new InvalidIdError(`${foodCode} is not in the food list for locale ${localeId}`);

    const localeCheck = await Locale.findOne({ where: { id: localeId }, attributes: ['id'] });
    if (localeCheck == null) throw new InvalidIdError(`Invalid locale ID: ${localeId}`);

    const foodLocal = await FoodLocal.findOne({ where: { foodCode, localeId } });

    if (foodLocal == null)
      throw new InvalidIdError(
        `No local food data for food code ${foodCode} in locale ${localeId}`
      );

    const associatedFoodPrompts = await resolveAssociatedFoodPrompts(localeId, foodCode);
    const brandNames = await getBrands(localeId, foodCode);
    const kcalPer100g = await getNutrientKCalPer100G(localeId, foodCode);
    const portionSizeMethods = await portionSizeMethodsImpl.resolvePortionSizeMethods(
      localeId,
      foodCode
    );
    const inheritableAttributes = await inheritableAttributesImpl.resolveInheritableAttributes(
      foodCode
    );

    return {
      associatedFoodPrompts,
      brandNames,
      code: foodRecord.code,
      englishDescription: foodRecord.description,
      groupCode: foodRecord.foodGroupId,
      kcalPer100g,
      localDescription: foodLocal.name,
      portionSizeMethods,
      readyMealOption: inheritableAttributes.readyMealOption,
      reasonableAmount: inheritableAttributes.reasonableAmount,
      sameAsBeforeOption: inheritableAttributes.sameAsBeforeOption,
    };
  };

  return {
    getNutrientKCalPer100G,
    getFoodData,
  };
};
