import type { Kysely } from 'kysely';

import { randomUUID } from 'node:crypto';

import { ApplicationError, ConflictError, NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { UseInRecipeType } from '@intake24/common/types';
import type {
  CreateGlobalCategoryRequest,
  GlobalCategoryEntry,
  UpdateGlobalCategoryRequest,
} from '@intake24/common/types/http/admin';
import type { FoodsDB } from '@intake24/db';

function globalCategoriesService({ kyselyDb }: Pick<IoC, 'kyselyDb'>) {
  async function updateParentCategories(
    categoryCode: string,
    parentCategoryCodes: string[],
    transaction: Kysely<FoodsDB>,
  ) {
    await transaction
      .deleteFrom('categoriesCategories')
      .where('subcategoryCode', '=', categoryCode)
      .execute();

    if (parentCategoryCodes.length > 0) {
      const catCatRecords = parentCategoryCodes.map(parentCode => ({
        categoryCode: parentCode,
        subcategoryCode: categoryCode,
      }));

      try {
        await transaction.insertInto('categoriesCategories').values(catCatRecords).execute();
      }
      catch (e: any) {
        if (e.code === '23503')
          throw new ApplicationError(e.detail);

        throw e;
      }
    }
  }

  const create = async (input: CreateGlobalCategoryRequest): Promise<void> => {
    await kyselyDb.foods.transaction().execute(async (t) => {
      try {
        await t
          .insertInto('categories')
          .values({
            version: input.version || randomUUID(),
            code: input.code,
            name: input.name,
            isHidden: input.isHidden,
          })
          .execute();
      }
      catch (e: any) {
        if (e.code === '23505')
          throw new ConflictError();
        else throw e;
      }

      if (input.parentCategories)
        await updateParentCategories(input.code, input.parentCategories, t);

      await t
        .insertInto('categoryAttributes')
        .values({
          categoryCode: input.code,
          sameAsBeforeOption: input.attributes.sameAsBeforeOption,
          readyMealOption: input.attributes.readyMealOption,
          reasonableAmount: input.attributes.reasonableAmount,
          useInRecipes: input.attributes.useInRecipes,
        })
        .execute();
    });
  };

  const update = async (
    categoryCode: string,
    version: string,
    input: UpdateGlobalCategoryRequest,
  ): Promise<void> => {
    await kyselyDb.foods.transaction().execute(async (t) => {
      const result = await t
        .updateTable('categories')
        .set({
          version: randomUUID(),
          name: input.name,
          isHidden: input.isHidden,
        })
        .where('code', '=', categoryCode)
        .where('version', '=', version)
        .executeTakeFirst();

      if (result.numUpdatedRows !== 1n)
        throw new NotFoundError();

      if (input.parentCategories)
        await updateParentCategories(categoryCode, input.parentCategories, t);

      if (
        input.attributes.sameAsBeforeOption
        || input.attributes.readyMealOption
        || input.attributes.reasonableAmount
        || input.attributes.useInRecipes
      ) {
        await t
          .updateTable('categoryAttributes')
          .set({
            sameAsBeforeOption: input.attributes.sameAsBeforeOption,
            readyMealOption: input.attributes.readyMealOption,
            reasonableAmount: input.attributes.reasonableAmount,
            useInRecipes: input.attributes.useInRecipes,
          })
          .where('categoryCode', '=', categoryCode)
          .execute();
      }
    });
  };

  const read = async (categoryCode: string): Promise<GlobalCategoryEntry> => {
    return await kyselyDb.foods.transaction().execute(async (t) => {
      const categoryRow = await t
        .selectFrom('categories')
        .leftJoin('categoryAttributes', jb =>
          jb.onRef('categories.code', '=', 'categoryAttributes.categoryCode'))
        .select([
          'code',
          'name',
          'version',
          'isHidden',
          'sameAsBeforeOption',
          'readyMealOption',
          'reasonableAmount',
          'useInRecipes',
        ])
        .where('code', '=', categoryCode)
        .executeTakeFirstOrThrow(() => new NotFoundError());

      const parentCategoryRows = await t
        .selectFrom('categoriesCategories')
        .select('categoryCode')
        .where('subcategoryCode', '=', categoryCode)
        .orderBy('categoryCode', 'asc')
        .execute();

      return {
        code: categoryRow.code,
        name: categoryRow.name,
        version: categoryRow.version,
        isHidden: categoryRow.isHidden,
        parentCategories: parentCategoryRows.map(r => r.categoryCode),
        attributes: {
          sameAsBeforeOption: categoryRow.sameAsBeforeOption ?? undefined,
          readyMealOption: categoryRow.readyMealOption ?? undefined,
          reasonableAmount: categoryRow.reasonableAmount ?? undefined,
          useInRecipes: (categoryRow.useInRecipes as UseInRecipeType | null) ?? undefined,
        },
      };
    });
  };

  return {
    create,
    read,
    update,
  };
}

export default globalCategoriesService;

export type GlobalCategoriesService = ReturnType<typeof globalCategoriesService>;
