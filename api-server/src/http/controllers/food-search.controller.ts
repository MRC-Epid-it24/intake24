import { Request, Response } from 'express';
import foodIndex, { IndexNotReadyError } from '@/food-index';


export default {
  async lookup(req: Request, res: Response): Promise<void> {
    const { locale } = req.params;

    if (typeof req.query.description !== 'string' || req.query.description.length === 0) {
      res.status(400).send('description cannot be empty');
      return Promise.resolve();
    };

    return foodIndex.search(req.query.description).then(
      (results) => {
        res.json(results);
      },
      (error) => {
        if (error instanceof IndexNotReadyError) {
          res.sendStatus(503);
          return Promise.resolve();
        }
        return Promise.reject(error);
      }
    );
  },

  async recipe(req: Request, res: Response): Promise<void> {
    const { locale } = req.params;
    res.json();
  },

  async category(req: Request, res: Response): Promise<void> {
    const { locale } = req.params;
    res.json();
  },

  async splitDescription(req: Request, res: Response): Promise<void> {
    const { locale } = req.params;
    res.json();
  },
};
