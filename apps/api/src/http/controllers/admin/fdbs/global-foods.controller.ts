import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import type { IoC } from '@intake24/api/ioc';
import { ForbiddenError } from '@intake24/api/http/errors';
import { SystemLocale } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const globalFoodsController = ({ adminFoodService }: Pick<IoC, 'adminFoodService'>) => {
  const store = async (req: Request, res: Response): Promise<void> => {
    const { aclService } = req.scope.cradle;

    // FIXME: add separate permissions for Foods
    if (!(await aclService.hasPermission('fdbs|create'))) throw new ForbiddenError();

    const createResult = await adminFoodService.createGlobalFood(req.body);

    if (createResult === 'conflict') res.status(HttpStatusCode.Conflict).end();
    else res.json(createResult);
  };

  return {
    store,
  };
};

export default globalFoodsController;

export type AdminGlobalFoodsController = ReturnType<typeof globalFoodsController>;
