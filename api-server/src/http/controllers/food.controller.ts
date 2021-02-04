import { Request, Response } from 'express';
import { FoodLocal, FoodCategory, FoodAttribute, PortionSizeMethod, PortionSizeMethodParameter } from '@/db/models/foods';
import { NotFoundError } from '../errors';
import { Controller } from './controller';
import { getAllParentCategories } from '@api-server/db/raw/food-controller-sql';
const { QueryTypes } = require('sequelize');


type FoodData = {
  [key: string]: any // FIXME: use more specific type
}

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default (): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {

  /* Constructing response object */
    const result: FoodData = {};
    const { code, localeId } = req.params;

    //1.Food data (Food Local), portionSizeMethod and PortiobSizeMethod Parameters
    const food = await FoodLocal.findOne({
      where: { localeId: localeId, foodCode: code },
      include: [{
        model: PortionSizeMethod,
        as: 'portionSizeMethods',
        attributes: ['method', 'description', 'imageUrl', 'useForRecipes', 'conversionFactor'],
        include: [{
          model: PortionSizeMethodParameter,
          as: 'parameters',
          attributes: ['name', 'value']
        }]
      }]
    });
    if (!food || food == null) {
      res.status(404).json("Not Found!");
    }
    else {
      result.code = food.foodCode;
      result.localDescription = food.name;
      result.portionSizeMethods = food.portionSizeMethods;
      result.readyMealOption = null;
      result.sameAsBeforeOption = null;

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
            type: QueryTypes.SELECT
          }
        );
        if (parentCat !== undefined && parentCat.length > 0) {
          const additionalCats = parentCat.reduce<string[]>((acc, currentCategory) => {
            // FIXME: TypeScript Error due to returned values.
            // @ts-ignore
            return currentCategory ? [...acc, currentCategory.category_code] : acc;
          }, [])
          result.categories = [...result.categories, ...additionalCats];
        } else { console.log('No parent categories were found! ') }
      }

      //4. Retrieving readyMealOption, sameAsBeforeOption
      const foodMealAndAsBeforeOptions = await FoodAttribute.findOne({
        where: { foodCode: code },
        attributes: ['sameAsBeforeOption', 'readyMealOption']
      });
      result.readyMealOption = foodMealAndAsBeforeOptions?.readyMealOption;
      result.sameAsBeforeOption = foodMealAndAsBeforeOptions?.sameAsBeforeOption;

      //5. Retrieving associatedFoods
      //const associatedFoods =

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
