import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import type { IoC } from '@intake24/api/ioc';
import { ForbiddenError } from '@intake24/api/http/errors';

const localFoodsController = ({
  adminFoodService,
  localFoodsService,
  logger,
  db,
}: Pick<IoC, 'adminFoodService' | 'localFoodsService' | 'logger' | 'db'>) => {
  const store = async (req: Request, res: Response): Promise<void> => {
    const { aclService } = req.scope.cradle;

    const { localeId } = req.params;

    const { update } = req.query;

    const _return = req.query.return;

    //const _return = req.query.return;

    // FIXME: check correct permission
    if (!(await aclService.hasPermission('fdbs|create'))) throw new ForbiddenError();

    const created = await localFoodsService.create(localeId, req.body, {
      update: update ? true : false,
      return: _return ? true : false,
    });

    res.status(created ? HttpStatusCode.Created : HttpStatusCode.Ok);

    if (_return) {
      const instance = await localFoodsService.find(localeId, req.body.code);
      res.json(instance);
    } else {
      res.end();
    }
  };

  const updateEnabledFoods = async (req: Request, res: Response): Promise<void> => {
    const { aclService } = req.scope.cradle;

    // FIXME: check correct permission
    if (!(await aclService.hasPermission('fdbs|edit'))) throw new ForbiddenError();

    await localFoodsService.updateEnabledFoods(req.params.localeId, req.body.enabledFoods);
    res.status(HttpStatusCode.Ok);
    res.end();
  };

  return {
    store,
    updateEnabledFoods,
  };
};

export default localFoodsController;

export type AdminLocalFoodsController = ReturnType<typeof localFoodsController>;
