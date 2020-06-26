import { Request, Response } from 'express';

export default {
  async lookup(req: Request, res: Response): Promise<void> {
    const { locale } = req.params;
    res.json();
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
