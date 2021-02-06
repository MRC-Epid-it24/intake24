import { Request, Response } from 'express';
import { IoC } from '@/ioc';
import { FoodDataEntryResponse } from '@common/types/http';
import { QueryTypes } from 'sequelize';
import {
  FoodLocal,
  FoodCategory,
  FoodAttribute,
  PortionSizeMethod,
  PortionSizeMethodParameter,
  AssociatedFood,
  Brand,
} from '@/db/models/foods';
import getAllParentCategories from '@api-server/db/raw/food-controller-sql';
import { NotFoundError } from '../errors';
import { Controller } from './controller';

type FoodData = {
  [key: string]: any; // FIXME: use more specific type
};

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default ({ foodDataService }: IoC): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;

    // 1.Food data (Food Local), portionSizeMethod and PortiobSizeMethod Parameters
    const food = await foodDataService.getFoodLocal(localeId, code);

    const result: FoodData = {
      code: food.foodCode,
      localDescription: food.name,
      portionSizeMethods: food.portionSizeMethods,
      readyMealOption: null,
      sameAsBeforeOption: null,
    };

    /**
     * TODO: Decouple everything into seperate methods and put in a seperate helper_utils file.
     *
     */
    // 2. Food categories
    const foodCategories = await FoodCategory.findAll({
      where: { foodCode: code },
      attributes: ['categoryCode'],
    });
    result.categories = foodCategories.reduce<string[]>(
      (acc, currentFoodCategory) => [...acc, currentFoodCategory.categoryCode],
      []
    );

    // 3. Retrieving all parent categories of categories
    if (result.categories != null && result.categories.length !== 0) {
      const parentCat = await FoodCategory.sequelize?.query(getAllParentCategories, {
        replacements: { subcategory_code: result.categories },
        type: QueryTypes.SELECT,
      });
      if (parentCat !== undefined && parentCat.length > 0) {
        const additionalCats = parentCat.reduce<string[]>((acc, currentCategory: FoodData) => {
          return currentCategory ? [...acc, currentCategory?.category_code] : acc;
        }, []);
        result.categories = [...result.categories, ...additionalCats];
      }
    }

    // 4. Retrieving readyMealOption, sameAsBeforeOption
    const foodMealAndAsBeforeOptions = await FoodAttribute.findOne({
      where: { foodCode: code },
      attributes: ['sameAsBeforeOption', 'readyMealOption'],
    });
    result.readyMealOption = foodMealAndAsBeforeOptions?.readyMealOption;
    result.sameAsBeforeOption = foodMealAndAsBeforeOptions?.sameAsBeforeOption;

    // 5. Retrieving associatedFoods
    const associatedFoods = await AssociatedFood.findAll({
      where: { localeId, foodCode: code },
      attributes: [
        'associatedFoodCode',
        'associatedCategoryCode',
        'text',
        'linkAsMain',
        'genericName',
      ],
    });
    result.associatedFoods = associatedFoods;
    // FIXME: Change from FoodDataa to the specific type
    result.associatedFoods = result.associatedFoods.map((el: FoodData) => {
      const newEl: FoodData = {};
      newEl.foodOrCategoryCode = [
        el.associatedCategoryCode ? 1 : 0,
        el.associatedCategoryCode ? el.associatedCategoryCode : el.associatedFoodCode,
      ];
      newEl.promptText = el.text;
      newEl.linkAsMain = el.linkAsMain;
      newEl.genericName = el.genericName;
      return newEl;
    });

    // 6 Brands
    const brands = await Brand.findAll({
      where: { localeId, foodCode: code },
      attributes: ['name'],
    });
    result.brands = brands;
    result.brands = result.brands ? result.brands.map((brand: FoodData) => brand.name) : [];

    // 6. Calculating caloriesPer100g

    res.status(200).json(result);
  };

  const entryWithSource = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;
    res.json();
  };

  const brands = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;
    res.json();
  };

  const associatedFoods = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;
    res.json();
  };

  const composition = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;
    res.json();
  };

  return {
    entry,
    entryWithSource,
    brands,
    associatedFoods,
    composition,
  };
};
