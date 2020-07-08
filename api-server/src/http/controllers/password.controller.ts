import { Request, Response } from 'express';

export default {
  async request(req: Request, res: Response): Promise<void> {
    res.json();
  },

  async reset(req: Request, res: Response): Promise<void> {
    res.json();
  },
};
