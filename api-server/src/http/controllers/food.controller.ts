import { Request, Response } from 'express';
import { FoodLocal, FoodCategory, Category } from '@/db/models/foods';
import { NotFoundError } from '../errors';
import { Controller } from './controller';
import { getAllParentCategories } from '@api-server/db/raw/food-controller-sql';
const { QueryTypes } = require('sequelize');


type FoodData = {
  [key: string]: any // FIXME: use more specific types
}

type ParentCategories = undefined | [null | { category_code: string }]

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default (): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {

  /* Constructing response object */
    const result: FoodData = {};
    const { code, localeId } = req.params;

    //1.Food data (Food Local)
    const food = await FoodLocal.findOne({
      where: { localeId: localeId, foodCode: code }
    });
    if (!food || food == null) {
      res.status(404).json("Not Found!");
    }
    else {
      result.code = food.foodCode;
      result.localDescription = food.name;

      //2. Food categories
      const foodCategories = await FoodCategory.findAll({
        where: { foodCode: code },
        attributes: ['categoryCode']
      })
      result.categories = foodCategories.reduce<string[]>((acc, currentFoodCategory) => [...acc, currentFoodCategory.categoryCode], []);

      //3. Retrieving all parent categories of categories
      if (result.categories != null && result.categories.length !== 0) {
        const parentCat = await FoodCategory.sequelize?.query(
          getAllParentCategories,
          {
            replacements: { subcategory_code: result.categories },
            raw: false,
            type: QueryTypes.SELECT
          }
        );
        if (parentCat !== undefined && parentCat[0]! == undefined) {
          console.log("Found some parent categories! ");
          console.log(parentCat[0]);
          //const caties = parentCat.reduce<string[]>((acc, currentFoodCategory) => [...acc, currentFoodCategory.categoryCode], []);
          //result.categories = [...result.categories, ...parentCat.category_code];
        } else { console.log("parent undefined"); }
      }
      //4. Retrieving readyMealOption, sameAsBeforeOption, portionSizeMethods

      //5. Retrieving associatedFoods and brands

      //6. Calculating caloriesPer100g

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
