import { Request, Response } from 'express';
import { FoodLocal, FoodLocalList } from '@/db/models/foods';
import { NotFoundError } from '../errors';

export default {
  async entry(req: Request, res: Response): Promise<void> {
    const { code, localeId } = req.params;

    const food = await FoodLocal.findOne({
      include: [{ model: FoodLocalList, where: { localeId } }],
      where: { foodCode: code },
    });

    if (!food) throw new NotFoundError();

    res.json(food);
  },

  async entryWithSource(req: Request, res: Response): Promise<void> {
    const { code, localeId } = req.params;
    res.json();
  },

  async brands(req: Request, res: Response): Promise<void> {
    const { code, localeId } = req.params;
    res.json();
  },

  async associatedFoods(req: Request, res: Response): Promise<void> {
    const { code, localeId } = req.params;
    res.json();
  },

  async composition(req: Request, res: Response): Promise<void> {
    const { code, localeId } = req.params;
    res.json();
  },
};
