import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import type { IoC } from '@intake24/api/ioc';
import { ForbiddenError } from '@intake24/api/http/errors';

const localCategoriesController = ({
  localCategoriesService,
}: Pick<IoC, 'localCategoriesService'>) => {
  const store = async (req: Request, res: Response): Promise<void> => {
    const { aclService } = req.scope.cradle;

    const { localeId } = req.params;

    // FIXME: use correct permission
    if (!(await aclService.hasPermission('locales|food-list'))) throw new ForbiddenError();

    await localCategoriesService.create(localeId, req.body);

    res.status(HttpStatusCode.Created);
    res.end();
  };

  const update = async (req: Request, res: Response): Promise<void> => {
    const { aclService } = req.scope.cradle;

    const { localeId, categoryId } = req.params;

    // FIXME: use correct permission
    if (!(await aclService.hasPermission('locales|food-list'))) throw new ForbiddenError();
    await localCategoriesService.update(categoryId, localeId, req.body);

    res.status(HttpStatusCode.Ok);
    res.end();
  };

  return {
    store,
    update,
  };
};

export default localCategoriesController;

export type AdminLocalCategoriesController = ReturnType<typeof localCategoriesController>;
