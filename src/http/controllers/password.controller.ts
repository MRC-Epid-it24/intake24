import { Request, Response, NextFunction } from 'express';

export default {
  async request(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.json();
  },

  async reset(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.json();
  },
};
