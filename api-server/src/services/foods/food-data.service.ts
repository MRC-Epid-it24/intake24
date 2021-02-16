import {
  AssociatedFood,
  Brand,
  CategoryAttribute,
  FoodAttribute,
  FoodCategory,
  FoodLocal,
  Locale,
  PortionSizeMethod,
  PortionSizeMethodParameter,
} from '@/db/models/foods';
import { NotFoundError } from '@/http/errors';
import { QueryTypes } from 'sequelize';
import {
  AssociatedFoodsResponse,
  FoodDataGeneral,
  FoodLocalResponse,
} from '@common/types/http';
import getAllParentCategories from '@api-server/db/raw/food-controller-sql';

export interface FoodDataService {
  getFoodLocal: (localId: string, foodCode: string) => Promise<FoodLocal>;
  getFoodCategories: (foodCode: string, parentCategories?: boolean) => Promise<string[] | []>;
  getFoodReadyMealAndSameAsBeforeAttributes: (
    foodCode: string,
    categories: string[] | []
  ) => Promise<FoodDataGeneral>;
  getAssociatedFoods: (localId: string, foodCode: string) => Promise<AssociatedFoodsResponse[]>;
  getBrands: (localId: string, foodCode: string) => Promise<string[] | []>;
  getCategoriesAttributes: (categories: string[] | []) => Promise<FoodDataGeneral>;
  getParentsLocalDescriptionPortionSizeMethodsAndParameters: (
    localId: string,
    foodCode: string,
    localDescription: string
  ) => Promise<FoodLocalResponse>;
}

export default (): FoodDataService => {
  /**
   *
   * Get food date corresponidng to locale and food code from the FoodLocale
   *
   * @param {string} localeId
   * @param {string} foodCode
   * @returns {Promise<FoodLocal>}
   */
  const getFoodLocal = async (localeId: string, foodCode: string): Promise<FoodLocal> => {
    const food = await FoodLocal.findOne({
      where: { localeId, foodCode },
      include: [
        {
          model: PortionSizeMethod,
          as: 'portionSizeMethods',
          attributes: ['method', 'description', 'imageUrl', 'useForRecipes', 'conversionFactor'],
          include: [
            {
              model: PortionSizeMethodParameter,
              as: 'parameters',
              attributes: ['name', 'value'],
            },
          ],
        },
      ],
    });

    if (!food || food == null) throw new NotFoundError();

    return food;
  };

  /**
   *
   * Get food categories corresponidng to its code from the FoodCategory
   *
   * @param {string} foodCode food Code
   * @param {boolean} parentCategories option to include parant categories in result
   * @returns {Promise<string[] | []>} array of categories names or empty array
   */
  const getFoodCategories = async (
    foodCode: string,
    parentCategories = false
  ): Promise<string[] | []> => {
    let categories: string[] | [] = [];

    const foodCategories = await FoodCategory.findAll({
      where: { foodCode },
      attributes: ['categoryCode'],
    });
    categories = foodCategories.reduce<string[]>(
      (acc, currentFoodCategory) => [...acc, currentFoodCategory.categoryCode],
      []
    );

    // Retrieving all parent categories of categories if parentCategories = true

    if (parentCategories && categories != null && categories.length !== 0) {
      const parentCat = await FoodCategory.sequelize?.query(getAllParentCategories, {
        replacements: { subcategory_code: categories },
        type: QueryTypes.SELECT,
      });
      if (parentCat !== undefined && parentCat.length > 0) {
        const additionalCats = parentCat.reduce<string[]>(
          (acc, currentCategory: FoodDataGeneral) => {
            return currentCategory ? [...acc, currentCategory?.category_code] : acc;
          },
          []
        );
        categories = [...categories, ...additionalCats];
      }
    }

    return categories;
  };

  /**
   * check readyMealOption & sameAsBeforeOption attributes for food's parent categories
   *
   * @param categories all parent categories of the food
   * @param readyMealOption existing readyMealOption attribute for this food
   * @param sameAsBeforeOption existing sameAsBeforeOption attribute for this food
   */
  const getCategoriesAttributes = async (
    categories: string[] | [],
    readyMealOption?: boolean | null,
    sameAsBeforeOption?: boolean | null
  ): Promise<FoodDataGeneral> => {
    let categoriesAttributes: FoodDataGeneral = {
      readyMealOption: readyMealOption !== undefined ? readyMealOption : null,
      sameAsBeforeOption: sameAsBeforeOption !== undefined ? sameAsBeforeOption : null,
    };
    if (categories && categories.length > 0) {
      const categoryAtrributeCheck = async (
        arr: string[],
        predicate: (code: string) => Promise<FoodDataGeneral>
      ) => {
        const res = categoriesAttributes;
        for (const code of arr) {
          const result = await predicate(code);
          if (result.readyMealOption !== null && result.sameAsBeforeOption !== null) return result;
        }
        return res;
      };

      categoriesAttributes = await categoryAtrributeCheck(categories, async (code: string) => {
        const categoryAttribute = await CategoryAttribute.findOne({
          where: { categoryCode: code },
          attributes: ['readyMealOption', 'sameAsBeforeOption'],
        });

        if (
          categoriesAttributes.readyMealOption === null &&
          categoryAttribute?.readyMealOption !== null
        ) {
          categoriesAttributes.readyMealOption = categoryAttribute?.readyMealOption;
        }

        if (
          categoriesAttributes.sameAsBeforeOption === null &&
          categoryAttribute?.sameAsBeforeOption !== null
        ) {
          categoriesAttributes.sameAsBeforeOption = categoryAttribute?.sameAsBeforeOption;
        }
        return categoriesAttributes;
      });
    }
    return categoriesAttributes;
  };

  /**
   *
   * Get food atributes (ready meal option & same as before) based on the code of the food from the FoodAttributes
   *
   * @param {string} foodCode code of the food to get attribues from
   * @returns {Promise<FoodDataGeneral>} object with sameAsBeforeOption and readyMealOption boolean fields
   */
  const getFoodReadyMealAndSameAsBeforeAttributes = async (
    foodCode: string,
    categories: string[] | []
  ): Promise<FoodDataGeneral> => {
    let foodAttributes: FoodDataGeneral = {};
    const foodMealAndAsBeforeOptions = await FoodAttribute.findOne({
      where: { foodCode },
      attributes: ['sameAsBeforeOption', 'readyMealOption'],
    });

    if (
      foodMealAndAsBeforeOptions === null ||
      foodMealAndAsBeforeOptions.readyMealOption === null ||
      foodMealAndAsBeforeOptions.sameAsBeforeOption === null
    ) {
      foodAttributes = await getCategoriesAttributes(
        categories,
        foodMealAndAsBeforeOptions?.readyMealOption,
        foodMealAndAsBeforeOptions?.sameAsBeforeOption
      );
    }

    foodAttributes.readyMealOption = foodAttributes.readyMealOption
      ? foodAttributes.readyMealOption
      : false;
    foodAttributes.sameAsBeforeOption = foodAttributes.sameAsBeforeOption
      ? foodAttributes.sameAsBeforeOption
      : false;

    return foodAttributes;
  };

  /**
   * Get Portion Size Methods associated with the parents of the locale id and food code provided
   * @param {string} localeId
   * @param {string} foodCode
   * @returns {Promise<AssociatedFoodsResponse[]>}
   */
  const getParentsLocalDescriptionPortionSizeMethodsAndParameters = async (
    localeId: string,
    foodCode: string,
    localDescription: string
  ): Promise<FoodLocalResponse> => {
    const parentLocale = await Locale.findOne({
      where: { id: localeId },
      attributes: ['prototypeLocaleId'],
    });

    let parentLocalDescriptionPortionSizeMethods: FoodLocalResponse = {
      code: foodCode,
      localDescription,
      portionSizeMethods: [],
    };

    if (!parentLocale || parentLocale.prototypeLocaleId === null)
      return parentLocalDescriptionPortionSizeMethods;
    await getFoodLocal(parentLocale.prototypeLocaleId, foodCode).then((data) => {
      parentLocalDescriptionPortionSizeMethods.portionSizeMethods = data.portionSizeMethods
        ? data.portionSizeMethods
        : [];
      parentLocalDescriptionPortionSizeMethods.localDescription = parentLocalDescriptionPortionSizeMethods.localDescription
        ? parentLocalDescriptionPortionSizeMethods.localDescription
        : data.name;
    });
    if (parentLocalDescriptionPortionSizeMethods.portionSizeMethods.length === 0)
      parentLocalDescriptionPortionSizeMethods = await getParentsLocalDescriptionPortionSizeMethodsAndParameters(
        parentLocale.prototypeLocaleId,
        foodCode,
        parentLocalDescriptionPortionSizeMethods.localDescription
      );
    return parentLocalDescriptionPortionSizeMethods;
  };

/**
 * Get all associated Foods that link to this locale and Food Code
 * @param {string} localeId
 * @param {string} foodCode
 * @returns {Promise<AssociatedFoodsResponse[]>}
 */
  const getAssociatedFoods = async (
    localeId: string,
    foodCode: string
  ): Promise<AssociatedFoodsResponse[]> => {
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

    const associated: AssociatedFoodsResponse[] = associatedFoods.map((el: FoodDataGeneral) => {
      const newEl: AssociatedFoodsResponse = {
        foodOrCategoryCode: [
          el.associatedCategoryCode ? 1 : 0,
          el.associatedCategoryCode ? el.associatedCategoryCode : el.associatedFoodCode,
        ],
        promptText: el.text,
        linkAsMain: el.linkAsMain,
        genericName: el.genericName,
      };
      return newEl;
    });
    return associated;
  };

  /**
   *
   * Get food brands based on the code of the food and localeId
   *
   * @param {string} localeId
   * @param {string} foodCode
   * @returns {Promise<string[] | []>}
   */
  const getBrands = async (localeId: string, foodCode: string): Promise<string[] | []> => {
    let brandsResponse: string[] | [] = [];
    const brands = await Brand.findAll({
      where: { localeId, foodCode },
      attributes: ['name'],
    });
    brandsResponse = brands ? brands.map((brand: FoodDataGeneral) => brand.name) : [];
    return brandsResponse;
  };

  return {
    getFoodLocal,
    getFoodCategories,
    getFoodReadyMealAndSameAsBeforeAttributes,
    getAssociatedFoods,
    getBrands,
    getCategoriesAttributes,
    getParentsLocalDescriptionPortionSizeMethodsAndParameters,
  };
};
