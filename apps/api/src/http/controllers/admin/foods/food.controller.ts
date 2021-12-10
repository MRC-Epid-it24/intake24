import { Request, Response } from 'express';
import type { Controller } from '../../controller';

export type AdminFoodController = Controller<'browse' | 'read'>;

export default (): AdminFoodController => {
  const browse = async (req: Request<{ localeId: string }>, res: Response): Promise<void> => {
    const { localeId } = req.params;

    res.json(localeId);
  };

  const read = async (req: Request<{ localeId: string }>, res: Response): Promise<void> => {
    const { localeId } = req.params;

    res.json(localeId);
  };

  return {
    browse,
    read,
  };
};
