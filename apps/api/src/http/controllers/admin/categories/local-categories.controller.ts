import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import type { IoC } from '@intake24/api/ioc';
import type { LocalCategoryEntry } from '@intake24/common/types/http/admin';
import { ConflictError, ForbiddenError } from '@intake24/api/http/errors';

const localCategoriesController = ({
  localCategoriesService,
}: Pick<IoC, 'localCategoriesService'>) => {
  const store = async (req: Request, res: Response): Promise<void> => {
    const { aclService } = req.scope.cradle;

    const { localeId } = req.params;

    // FIXME: use correct permission
    if (!(await aclService.hasPermission('locales|food-list'))) throw new ForbiddenError();

    try {
      await localCategoriesService.create(localeId, req.body);
      res.status(HttpStatusCode.Created);
      res.end();
    } catch (e: any) {
      if (e instanceof ConflictError) {
        const existing = await localCategoriesService.read(localeId, req.body.code);
        res.status(HttpStatusCode.Conflict).json(existing);
      } else throw e;
    }
  };

  const update = async (req: Request, res: Response): Promise<void> => {
    const { aclService } = req.scope.cradle;

    const { localeId, categoryId } = req.params;
    const { version } = req.query;

    // FIXME: use correct permission
    if (!(await aclService.hasPermission('locales|food-list'))) throw new ForbiddenError();

    await localCategoriesService.update(
      categoryId,
      localeId,
      version as string /* unsafe! */,
      req.body
    );

    res.status(HttpStatusCode.Ok);
    res.end();
  };

  const read = async (req: Request, res: Response<LocalCategoryEntry>): Promise<void> => {
    const { aclService } = req.scope.cradle;

    // FIXME: use correct permission
    if (!(await aclService.hasPermission('locales|food-list'))) throw new ForbiddenError();

    const { localeId, categoryId } = req.params;

    const result = await localCategoriesService.read(localeId, categoryId);

    res.status(HttpStatusCode.Ok).json(result);
  };

  return {
    store,
    update,
    read,
  };
};

export default localCategoriesController;

export type AdminLocalCategoriesController = ReturnType<typeof localCategoriesController>;
