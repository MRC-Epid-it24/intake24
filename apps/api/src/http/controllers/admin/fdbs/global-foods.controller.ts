import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import type { IoC } from '@intake24/api/ioc';
import type { FoodEntry, UpdateGlobalFoodRequest } from '@intake24/common/types/http/admin';
import { ForbiddenError } from '@intake24/api/http/errors';

const globalFoodsController = ({ adminFoodService }: Pick<IoC, 'adminFoodService'>) => {
  const store = async (req: Request, res: Response): Promise<void> => {
    const { aclService } = req.scope.cradle;

    // FIXME: add separate permissions for Foods
    if (!(await aclService.hasPermission('fdbs|create'))) throw new ForbiddenError();

    const entry = await adminFoodService.createGlobalFood(req.body);
    res.json(entry);
  };

  const update = async (
    req: Request<{ foodId: string; version: string }, any, UpdateGlobalFoodRequest>,
    res: Response<FoodEntry>
  ): Promise<void> => {
    const { aclService } = req.scope.cradle;

    // FIXME: add separate permissions for Foods
    if (!(await aclService.hasPermission('fdbs|edit'))) throw new ForbiddenError();

    const { foodId } = req.params;
    const { version } = req.query;
    const request = req.body;

    const entry = await adminFoodService.updateGlobalFood(foodId, version as string, request);

    if (entry === null) {
      res.status(HttpStatusCode.NotFound);
      res.end();
    } else {
      res.status(HttpStatusCode.Ok);
      res.json(entry);
    }
  };

  const read = async (
    req: Request<{ foodId: string }>,
    res: Response<FoodEntry>
  ): Promise<void> => {
    const { aclService } = req.scope.cradle;

    // FIXME: add separate permissions for Foods
    if (!(await aclService.hasPermission('fdbs|read'))) throw new ForbiddenError();

    const { foodId } = req.params;

    const entry = await adminFoodService.getGlobalFood(foodId);

    if (entry === null) {
      res.status(HttpStatusCode.NotFound);
      res.end();
    } else {
      res.json(entry);
    }
  };

  return {
    store,
    update,
    read,
  };
};

export default globalFoodsController;

export type AdminGlobalFoodsController = ReturnType<typeof globalFoodsController>;
