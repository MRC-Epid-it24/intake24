import { randomUUID } from 'node:crypto';

import type { IoC } from '@intake24/api/ioc';
import type {
  CreateGlobalFoodRequest,
  FoodEntry,
  UpdateGlobalFoodRequest,
} from '@intake24/common/types/http/admin';
import { Category, Food, FoodAttribute, FoodCategory } from '@intake24/db';

function globalFoodsService({ db }: Pick<IoC, 'db'>) {
  const create = async (input: CreateGlobalFoodRequest): Promise<FoodEntry> => {
    return await Food.create({
      version: randomUUID(),
      ...input,
    });
  };

  const update = async (
    globalFoodId: string,
    version: string,
    input: UpdateGlobalFoodRequest,
  ): Promise<FoodEntry | null> => {
    return await db.foods.transaction(async (t) => {
      const affectedRows = await Food.update(
        {
          name: input.name,
          foodGroupId: input.foodGroupId,
          version: randomUUID(),
        },
        { where: { code: globalFoodId, version }, transaction: t },
      );

      // Record with matching food code/version does not exist
      if (affectedRows[0] !== 1)
        return null;

      // Record exists, update associations
      await FoodAttribute.update(
        {
          ...input.attributes,
        },
        { where: { foodCode: globalFoodId }, transaction: t },
      );

      await FoodCategory.destroy({ where: { foodCode: globalFoodId }, transaction: t });

      const categoryEntries
        = input.parentCategories === undefined
          ? []
          : input.parentCategories.map(categoryId => ({
              foodCode: globalFoodId,
              categoryCode: categoryId,
            }));

      await FoodCategory.bulkCreate(categoryEntries, { transaction: t });

      return await Food.findOne({
        where: { code: globalFoodId },
        include: [FoodAttribute, Category],
        transaction: t,
      });
    });
  };

  const read = async (foodId: string): Promise<FoodEntry | null> => {
    return await Food.findOne({ where: { code: foodId }, include: [FoodAttribute, Category] });
  };

  return {
    create,
    read,
    update,
  };
}

export default globalFoodsService;

export type GlobalFoodsService = ReturnType<typeof globalFoodsService>;
