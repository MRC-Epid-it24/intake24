import { Request, Response } from 'express';
import { FoodLocal, PortionSizeMethod, PortionSizeMethodParameter } from '@/db/models/foods';
import { NotFoundError } from '../errors';
import { Controller } from './controller';

type FoodData = {
  [key: string]: any; // FIXME: use more specific type
};

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default (): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;

    // 1.Food data (Food Local), portionSizeMethod and PortiobSizeMethod Parameters
    const food = await FoodLocal.findOne({
      where: { localeId, foodCode: code },
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

    const result: FoodData = {
      code: food.foodCode,
      localDescription: food.name,
      portionSizeMethods: food.portionSizeMethods,
      readyMealOption: null,
      sameAsBeforeOption: null,
    };

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
