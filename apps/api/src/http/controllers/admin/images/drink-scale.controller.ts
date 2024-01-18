import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { DrinkScaleEntry } from '@intake24/common/types/http/admin';
import type { PaginateQuery, Pagination } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';

const drinkScaleController = ({
  logger,
  drinkwareSetService,
}: Pick<IoC, 'logger' | 'drinkwareSetService'>) => {
  const browse = async (
    req: Request<{ drinkwareSetId: string }, any, any, PaginateQuery>,
    res: Response<DrinkScaleEntry[]>
  ): Promise<void> => {
    const { drinkwareSetId } = req.params;

    logger.warn(JSON.stringify(Object.getOwnPropertyNames(drinkwareSetService)));

    const scales = await drinkwareSetService.getDrinkScales(drinkwareSetId);

    res.json(scales);
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  return {
    browse,
    refs,
  };
};

export default drinkScaleController;

export type DrinkScaleController = ReturnType<typeof drinkScaleController>;
