import { Request, Response } from 'express';
import type { IoC } from '@/ioc';
import { FoodDataEntryResponse } from '@common/types/http';
import { Controller } from './controller';

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default ({ foodDataService }: Pick<IoC, 'foodDataService'>): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;

    // 1.Food data (Food Local), portionSizeMethod and PortiobSizeMethod Parameters
    const food = await foodDataService.getFoodLocal(localeId, code, true);

    const result: FoodDataEntryResponse = {
      code: food.foodCode,
      localDescription: food.name,
      readyMealOption: false,
      sameAsBeforeOption: false,
      caloriesPer100g: 0,
      portionSizeMethods: food.portionSizeMethods ? food.portionSizeMethods : [],
      associatedFoods: [],
      brands: [],
      categories: [],
    };

    // 2. Food categories & parent categories
    result.categories = await foodDataService.getFoodCategories(code, true);

    // 3. Retrieving readyMealOption, sameAsBeforeOption (including traversing over parent categories)
    const foodAttributes = await foodDataService.getFoodReadyMealAndSameAsBeforeAttributes(
      code,
      result.categories
    );
    result.readyMealOption = foodAttributes.readyMealOption;
    result.sameAsBeforeOption = foodAttributes.sameAsBeforeOption;

    // 4. Retrieving associatedFoods
    result.associatedFoods = await foodDataService.getAssociatedFoods(localeId, code);

    // 5. Retrieving Local Description, Portion Size Methods and Methods Parameters from the parent locales
    if (!result.portionSizeMethods.length || !result.associatedFoods.length) {
      console.log(
        'Looking for parent local description, Portion Size Methods and associated foods'
      );
      const parentFoodData = await foodDataService.getParentsLocalDescriptionAssociatedFoodsPortionSizeMethodsAndParameters(
        localeId,
        code,
        result.localDescription,
        result.associatedFoods,
        result.portionSizeMethods
      );
      result.portionSizeMethods = parentFoodData[0].portionSizeMethods;
      result.localDescription = result.localDescription
        ? result.localDescription
        : parentFoodData[0].localDescription;
      result.associatedFoods = result.associatedFoods.length
        ? result.associatedFoods
        : parentFoodData[1];
    }

    // 6. Retrieving Portion Size Methods and Methods Parameters from the parent categories
    if (!result.portionSizeMethods.length) {
      const categoryPortionSizeMethods = await foodDataService.searchForPortionMethodsAcrossCategoriesAndLocales(
        localeId,
        result.categories
      );
      result.portionSizeMethods = categoryPortionSizeMethods;
    }

    // 7 Brands
    result.brands = await foodDataService.getBrands(localeId, code);

    // 8. Calculating caloriesPer100g
    result.caloriesPer100g = await foodDataService.getNutrientKCalPer100G(localeId, code);
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
