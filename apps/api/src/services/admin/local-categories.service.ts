import type { Kysely } from 'kysely';

import { randomUUID } from 'node:crypto';

import { ConflictError, NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import { toSimpleName } from '@intake24/api/util';
import type { PortionSizeMethod, PortionSizeMethodId } from '@intake24/common/surveys';
import type {
  CreateLocalCategoryRequest,
  LocalCategoryEntry,
  UpdateLocalCategoryRequest,
} from '@intake24/common/types/http/admin';
import type { FoodsDB } from '@intake24/db';

function localCategoriesService({ kyselyDb }: Pick<IoC, 'kyselyDb'>) {
  async function updatePortionSizeMethods(
    categoryLocalId: string,
    portionSizeMethods: PortionSizeMethod[],
    transaction: Kysely<FoodsDB>,
  ): Promise<void> {
    await transaction
      .deleteFrom('categoryPortionSizeMethods')
      .where('categoryLocalId', '=', categoryLocalId)
      .execute();

    if (portionSizeMethods.length > 0) {
      await transaction
        .insertInto('categoryPortionSizeMethods')
        .values(eb =>
          portionSizeMethods.map(m => ({
            categoryLocalId,
            method: m.method,
            description: m.description,
            useForRecipes: m.useForRecipes,
            conversionFactor: m.conversionFactor,
            orderBy: eb.ref('id'),
            parameters: JSON.stringify(m.parameters),
          })),
        )
        .execute();
    }
  }

  const create = async (localeId: string, request: CreateLocalCategoryRequest): Promise<void> => {
    await kyselyDb.foods.transaction().execute(async (t) => {
      try {
        const { id: categoryLocalId } = await t
          .insertInto('categoryLocals')
          .values({
            version: request.version || randomUUID(),
            categoryCode: request.code,
            localeId,
            name: request.name,
            simpleName: toSimpleName(request.name)!,
            tags: JSON.stringify(request.tags ?? []),
          })
          .returning('id')
          .executeTakeFirstOrThrow();

        await updatePortionSizeMethods(categoryLocalId, request.portionSizeMethods, t);
      }
      catch (e: any) {
        if (e.code === '23505')
          throw new ConflictError();
        else throw e;
      }
    });
  };

  const update = async (
    categoryCode: string,
    localeId: string,
    version: string,
    request: UpdateLocalCategoryRequest,
  ): Promise<void> => {
    await kyselyDb.foods.transaction().execute(async (t) => {
      const result = await t
        .updateTable('categoryLocals')
        .set({
          version: randomUUID(),
          localeId,
          name: request.name,
          simpleName: toSimpleName(request.name)!,
          tags: JSON.stringify(request.tags ?? []),
        })
        .where('localeId', '=', localeId)
        .where('categoryCode', '=', categoryCode)
        .where('version', '=', version)
        .returning('id')
        .executeTakeFirst();

      if (result === undefined)
        throw new NotFoundError();

      await updatePortionSizeMethods(result.id, request.portionSizeMethods, t);
    });
  };

  const read = async (localeId: string, categoryCode: string): Promise<LocalCategoryEntry> => {
    return await kyselyDb.foods.transaction().execute(async (t) => {
      const categoryLocalsRow = await t
        .selectFrom('categoryLocals')
        .select(['id', 'name', 'version'])
        .where('localeId', '=', localeId)
        .where('categoryCode', '=', categoryCode)
        .executeTakeFirst();

      if (categoryLocalsRow === undefined)
        throw new NotFoundError();

      const portionSizeRows = await t
        .selectFrom('categoryPortionSizeMethods')
        .select(['method', 'description', 'useForRecipes', 'conversionFactor', 'orderBy', 'parameters'])
        .where('categoryLocalId', '=', categoryLocalsRow.id)
        .execute();

      const portionSizeMethods: PortionSizeMethod[] = portionSizeRows.map(row => ({
        method: row.method as PortionSizeMethodId /* unsafe! */,
        conversionFactor: row.conversionFactor,
        description: row.description,
        useForRecipes: row.useForRecipes,
        orderBy: row.orderBy,
        parameters: JSON.parse(row.parameters) /* unsafe! */,
      }));

      return {
        categoryCode,
        localeId,
        id: categoryLocalsRow.id,
        version: categoryLocalsRow.version,
        name: categoryLocalsRow.name,
        portionSizeMethods,
      };
    });
  };
  return {
    create,
    update,
    read,
  };
}

export default localCategoriesService;

export type LocalCategoriesService = ReturnType<typeof localCategoriesService>;
