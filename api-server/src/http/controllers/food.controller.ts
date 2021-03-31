import { Request, Response } from 'express';
import type { IoC } from '@/ioc';
import InvalidIdError from '@/services/foods/invalid-id-error';
import { NotFoundError } from '@/http/errors';
import { Controller } from './controller';

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default ({ foodDataService }: Pick<IoC, 'foodDataService'>): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;

    try {
      const response = await foodDataService.getFoodData(localeId, code);
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
