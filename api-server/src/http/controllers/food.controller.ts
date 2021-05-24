import { Request, Response } from 'express';
import type { IoC } from '@/ioc';
import InvalidIdError from '@/services/foods/invalid-id-error';
import { NotFoundError } from '@/http/errors';
import { Controller } from './controller';

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default ({
  foodDataService,
  imagesBaseUrl,
}: Pick<IoC, 'foodDataService' | 'imagesBaseUrl'>): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;

    try {
      const response = await foodDataService.getFoodData(localeId, code);

      for (let i = 0; i < response.portionSizeMethods.length; ++i) {
        response.portionSizeMethods[
          i
        ].imageUrl = `${imagesBaseUrl}/${response.portionSizeMethods[i].imageUrl}`;
      }

      res.status(200).json(response);
    } catch (err) {
      if (err instanceof InvalidIdError) throw new NotFoundError(err.message);
      throw err;
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
