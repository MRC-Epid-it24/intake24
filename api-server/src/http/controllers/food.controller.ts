import { Request, Response } from 'express';
import { FoodLocal, FoodLocalList, FoodCategory } from '@/db/models/foods';
import { NotFoundError } from '../errors';
import { Controller } from './controller';

type FoodData = {
  [key: string]: any // FIXME: use more specific types
}

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default (): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {
    //constructing response object
    const result: FoodData = {};
    const { code, localeId } = req.params;

    //1.Food data
    const food = await FoodLocal.findOne({
      where: { localeId: localeId, foodCode: code }
    });
    if (!food || food == null) {
      res.status(404).json("Not Found!");
    }
    else {
      //2. Food categories and parent categories
      const foodCategories = await FoodCategory.findAll({
        where: { foodCode: code },
        attributes: ['categoryCode']
      });

      //3. Retrieving all parent categories of categories

      //4. Retrieving readyMealOption, sameAsBeforeOption, portionSizeMethods

      //5. Retrieving associatedFoods and brands

      //6. Calculating caloriesPer100g

      //TODO: More elegant way of bulk assignment of properties
      result.code = food.foodCode;
      result.localDescription = food.name;
      result.categories = foodCategories.reduce<string[]>((acc, currentFoodCategory) => [...acc, currentFoodCategory.categoryCode], []);

      res.status(200).json(result);
    }
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
