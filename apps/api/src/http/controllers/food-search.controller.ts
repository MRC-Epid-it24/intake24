import type { Request, Response } from 'express';

import foodIndex, { IndexNotReadyError } from '@intake24/api/food-index';

const foodSearchController = () => {
  const lookup = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;

    if (typeof req.query.description !== 'string' || !req.query.description.length) {
      res.status(400).send('description cannot be empty');
      return;
    }

    try {
      const results = await foodIndex.search(req.query.description);
      res.json(results);
    } catch (err) {
      if (err instanceof IndexNotReadyError) {
        res.sendStatus(503);
        return;
      }
      throw err;
    }
  };

  const recipe = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    res.json();
  };

  const category = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    const { code } = req.query;

    res.json();
  };

  const splitDescription = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    res.json();
  };

  return {
    lookup,
    recipe,
    category,
    splitDescription,
  };
};

export default foodSearchController;

export type FoodSearchController = ReturnType<typeof foodSearchController>;
