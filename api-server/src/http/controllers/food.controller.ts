import { Request, Response } from 'express';
import { IoC } from '@/ioc';
import { FoodDataEntryResponse } from '@common/types/http';
import { Controller } from './controller';

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default ({ foodDataService }: IoC): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;

    // 1.Food data (Food Local), portionSizeMethod and PortiobSizeMethod Parameters
    const food = await foodDataService.getFoodLocal(localeId, code);

    const result: FoodDataEntryResponse = {
      code: food.foodCode,
      localDescription: food.name,
      portionSizeMethods: food.portionSizeMethods ? food.portionSizeMethods : [],
      readyMealOption: false,
      sameAsBeforeOption: false,
      categories: [],
      associatedFoods: [],
      brands: [],
      caloriesPer100g: 0,
    };

    // 2. Food categories & parent categories
    result.categories = await foodDataService.getFoodCategories(code, true);

    // 4. Retrieving readyMealOption, sameAsBeforeOption
    const foodAttributes = await foodDataService.getFoodReadyMealAndSameAsBeforeAttributes(code);
    result.readyMealOption = foodAttributes.readyMealOption;
    result.sameAsBeforeOption = foodAttributes.sameAsBeforeOption;

    // 5. Retrieving associatedFoods
    result.associatedFoods = await foodDataService.getAssociatedFoods(localeId, code);

    // 6 Brands
    result.brands = await foodDataService.getBrands(localeId, code);

    // 7. Calculating caloriesPer100g

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
