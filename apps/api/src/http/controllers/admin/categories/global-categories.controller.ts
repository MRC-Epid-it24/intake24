import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

import type { IoC } from '@intake24/api/ioc';
import type {
  CreateGlobalCategoryRequest,
  FoodEntry,
  GlobalCategoryEntry,
  UpdateGlobalCategoryRequest,
} from '@intake24/common/types/http/admin';
import { ConflictError, ForbiddenError } from '@intake24/api/http/errors';

function globalCategoriesController({
  globalCategoriesService,
}: Pick<IoC, 'globalCategoriesService'>) {
  const store = async (
    req: Request<any, any, any, CreateGlobalCategoryRequest>,
    res: Response,
  ): Promise<void> => {
    const { aclService } = req.scope.cradle;

    if (!(await aclService.hasPermission('fdbs|edit')))
      throw new ForbiddenError();

    // Doing this operation properly is difficult, see
    // https://stackoverflow.com/questions/34708509/how-to-use-returning-with-on-conflict-in-postgresql

    // This implementation ignores race conditions between the insert attempt and the following read

    try {
      await globalCategoriesService.create(req.body);
      const inserted = await globalCategoriesService.read(req.body.code);
      res.status(HttpStatusCode.Created).json(inserted);
    }
    catch (e: any) {
      if (e instanceof ConflictError) {
        const existing = await globalCategoriesService.read(req.body.code);
        res.status(HttpStatusCode.Conflict).json(existing);
      }
      else {
        throw e;
      }
    }
  };

  const update = async (
    req: Request<{ categoryId: string; version: string }, any, UpdateGlobalCategoryRequest>,
    res: Response<FoodEntry>,
  ): Promise<void> => {
    const { aclService } = req.scope.cradle;

    if (!(await aclService.hasPermission('fdbs|edit')))
      throw new ForbiddenError();

    const { categoryId } = req.params;
    const { version } = req.query;
    const request = req.body;

    await globalCategoriesService.update(categoryId, version as string /* unsafe! */, request);

    res.status(HttpStatusCode.Ok);
    res.end();
  };

  const read = async (req: Request, res: Response<GlobalCategoryEntry>): Promise<void> => {
    const { aclService } = req.scope.cradle;

    // FIXME: use correct permission
    if (!(await aclService.hasPermission('fdbs|read')))
      throw new ForbiddenError();

    const { categoryId } = req.params;

    const result = await globalCategoriesService.read(categoryId);

    res.status(HttpStatusCode.Ok).json(result);
  };

  return {
    store,
    update,
    read,
  };
}

export default globalCategoriesController;

export type AdminGlobalCategoriesController = ReturnType<typeof globalCategoriesController>;
