import { randomUUID } from 'node:crypto';

import type { IoC } from '@intake24/api/ioc';
import type {
  CreateLocalCategoryRequest,
  UpdateLocalCategoryRequest,
} from '@intake24/common/types/http/admin';
import { toSimpleName } from '@intake24/api/util';

const localCategoriesService = ({ kyselyDb }: Pick<IoC, 'kyselyDb'>) => {
  const create = async (localeId: string, request: CreateLocalCategoryRequest): Promise<void> => {
    await kyselyDb.foods.transaction().execute(async (t) => {
      await t
        .insertInto('categoryLocals')
        .values({
          version: randomUUID(),
          categoryCode: request.code,
          localeId,
          name: request.name,
          simpleName: toSimpleName(request.name)!,
        })
        .execute();

      // TODO: update PSM (pull refactoring of psm params first)
    });
  };

  const update = async (
    categoryCode: string,
    localeId: string,
    request: UpdateLocalCategoryRequest
  ): Promise<void> => {
    await kyselyDb.foods.transaction().execute(async (t) => {
      await t
        .updateTable('categoryLocals')
        .set({
          version: randomUUID(),
          localeId,
          name: request.name,
          simpleName: toSimpleName(request.name)!,
        })
        .where('localeId', '=', localeId)
        .where('categoryCode', '=', categoryCode)
        .execute();

      // TODO: update PSM (pull refactoring of psm params first)
    });
  };

  return {
    create,
    update,
  };
};

export default localCategoriesService;

export type LocalCategoriesService = ReturnType<typeof localCategoriesService>;
