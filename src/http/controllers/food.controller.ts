import { Request, Response } from 'express';

export default {
  async entry(req: Request, res: Response): Promise<void> {
    const { code, locale } = req.params;
    res.json();
  },

  async entryWithSource(req: Request, res: Response): Promise<void> {
    const { code, locale } = req.params;
    res.json();
  },

  async brands(req: Request, res: Response): Promise<void> {
    const { code, locale } = req.params;
    res.json();
  },

  async associatedFoods(req: Request, res: Response): Promise<void> {
    const { code, locale } = req.params;
    res.json();
  },

  async composition(req: Request, res: Response): Promise<void> {
    const { code, locale } = req.params;
    res.json();
  },
};
