import { Request, Response } from 'express';
import { FoodLocal, FoodLocalList } from '@/db/models/foods';
import { NotFoundError } from '../errors';
import { Controller } from './controller';

export type FoodController = Controller<
  'entry' | 'entryWithSource' | 'brands' | 'associatedFoods' | 'composition'
>;

export default (): FoodController => {
  const entry = async (req: Request, res: Response): Promise<void> => {
    const { code, localeId } = req.params;

    const food = await FoodLocal.findOne({
      include: [{ model: FoodLocalList, where: { localeId } }],
      where: { foodCode: code },
    });

    if (!food) throw new NotFoundError();

    res.json(food);
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
