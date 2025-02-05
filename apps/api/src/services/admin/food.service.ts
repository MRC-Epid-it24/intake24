import { randomUUID } from 'node:crypto';
import { pick } from 'lodash';

import { NotFoundError } from '@intake24/api/http/errors';

import { foodsResponse } from '@intake24/api/http/responses/admin';
import type { IoC } from '@intake24/api/ioc';
import { toSimpleName } from '@intake24/api/util';
import type {
  FoodCopyInput,
  FoodInput,
  FoodLocalCopySource,
} from '@intake24/common/types/http/admin';
import type { FindOptions, FoodAttributes, PaginateQuery, Transaction } from '@intake24/db';
import { AssociatedFood, Food, FoodPortionSizeMethod, Op } from '@intake24/db';
import { CacheKey } from '../core/redis/cache';

function adminFoodService({ cache, db }: Pick<IoC, 'cache' | 'db'>) {
  const browseFoods = async (localeId: string, query: PaginateQuery) => {
    const options: FindOptions<FoodAttributes> = { where: { localeId } };
    const { search } = query;

    if (search) {
      const op
        = Food.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['code', 'englishName', 'name'].map(column => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return Food.paginate({ query, transform: foodsResponse, ...options });
  };

  const getFoodImpl = async (foodId: { id: string } | { foodCode: string }, localeCode?: string) => {
    const where = { localeId: localeCode };

    return Food.findOne({
      where: { ...where, id: foodId },
      include: [
        { association: 'brands', where, required: false, separate: true },
        { association: 'foodGroup' },
        {
          association: 'parentCategories',
          through: { attributes: [] },
        },
        {
          association: 'associatedFoods',
          required: false,
          separate: true,
          where,
          include: [{ association: 'associatedCategory' }, { association: 'associatedFood' }],
          order: [['orderBy', 'ASC']],
        },
        {
          association: 'portionSizeMethods',
          separate: true,
          order: [['orderBy', 'ASC']],
        },
        { association: 'nutrientRecords', through: { attributes: [] } },
      ],
    });
  };

  const getFoodByCode = async (foodCode: string, localeCode: string) => getFoodImpl({ foodCode }, localeCode);

  const getFood = async (foodLocalId: string, localeCode: string) => getFoodImpl({ id: foodLocalId }, localeCode);

  const updatePortionSizeMethods = async (
    foodId: string,
    methods: FoodPortionSizeMethod[],
    inputs: FoodInput['portionSizeMethods'],
    { transaction }: { transaction: Transaction },
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await FoodPortionSizeMethod.destroy({ where: { foodId, id: { [Op.notIn]: ids } }, transaction });

    if (!inputs.length)
      return [];

    const newMethods: FoodPortionSizeMethod[] = [];

    for (const input of inputs) {
      const { id, ...rest } = input;

      if (id) {
        const match = methods.find(method => method.id === id);
        if (match) {
          await match.update(rest, { transaction });
          continue;
        }
      }

      const newMethod = await FoodPortionSizeMethod.create({ ...rest, foodId }, { transaction });
      newMethods.push(newMethod);
    }

    return [...methods, ...newMethods];
  };

  const updateAssociatedFoods = async (
    foodId: string,
    foods: AssociatedFood[],
    inputs: FoodInput['associatedFoods'],
    { transaction }: { transaction: Transaction },
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await AssociatedFood.destroy({ where: { foodId, id: { [Op.notIn]: ids } }, transaction });

    if (!inputs.length)
      return [];

    const newFoods: AssociatedFood[] = [];

    for (const input of inputs) {
      const { id, ...rest } = input;

      if (id) {
        const match = foods.find(food => food.id === id);
        if (match) {
          await match.update(rest, { transaction });
          continue;
        }
      }

      const newFood = await AssociatedFood.create({ ...rest, foodId }, { transaction });
      newFoods.push(newFood);
    }

    return [...foods, ...newFoods];
  };

  const createFood = async (localeCode: string, input: FoodInput) => {
    const food = await db.foods.transaction(async (transaction) => {
      const food = await Food.create(
        {
          code: input.code,
          localeId: localeCode,
          englishName: input.englishName,
          name: input.name,
          simpleName: toSimpleName(input.name),
          foodGroupId: input.foodGroupId,
          tags: input.tags,
          excludeTags: input.excludeTags,
          version: randomUUID(),
        },
        { transaction },
      );
      if (input.parentCategories?.length) {
        const categories = input.parentCategories.map(({ id }) => id);
        await food.$add('parentCategories', categories, { transaction });
      }

      return food;
    });

    return (await getFood(localeCode, food.id))!;
  };

  const updateFood = async (localeCode: string, foodId: string, input: FoodInput) => {
    const food = await getFood(localeCode, foodId);
    if (!food)
      throw new NotFoundError();

    const { portionSizeMethods, associatedFoods } = food;
    if (!associatedFoods || !portionSizeMethods)
      throw new NotFoundError();

    const foodCacheKeys: CacheKey[] = [
      `food-entry:${localeCode}:${food.code}`,
      `food-all-categories:${foodId}`,
      `food-all-category-codes:${localeCode}:${food.code}`,
      `food-parent-categories:${foodId}`,
    ];

    await db.foods.transaction(async (transaction) => {
      const nutrientRecords = input.nutrientRecords.map(({ id }) => id);

      const promises: Promise<any>[] = [
        food.update({
          ...pick(input, ['code', 'englishName', 'name', 'simpleName', 'foodGroupId', 'altNames', 'tags', 'excludeTags']),
          simpleName: toSimpleName(input.name),
          version: randomUUID(),
        }, { transaction }),
        food.$set('nutrientRecords', nutrientRecords, { transaction }),
        updatePortionSizeMethods(foodId, portionSizeMethods, input.portionSizeMethods, { transaction }),
        updateAssociatedFoods(foodId, associatedFoods, input.associatedFoods, { transaction }),
      ];

      if (input.parentCategories) {
        const categories = input.parentCategories.map(({ id }) => id);
        promises.push(food.$set('parentCategories', categories, { transaction }));
      }

      await Promise.all(promises);

      /* if (input.main?.code && input.main.code !== main.code) {
        await Food.update({ code: input.main.code }, { where: { code: main.code }, transaction });
        foodCacheKeys.push(
          `food-attributes:${input.main.code}`,
          `food-entry:${localeCode}:${input.main.code}`,
          `food-all-categories:${input.main.code}`,
          `food-parent-categories:${input.main.code}`,
        );
      } */
    });

    await Promise.all([
      cache.forget(foodCacheKeys),
      cache.push('indexing-locales', localeCode),
    ]);

    return (await getFood(localeCode, foodId))!;
  };

  const copyFood = async ({ foodId, localeId, localeCode }: FoodLocalCopySource, input: FoodCopyInput) => {
    const sourceFood = await getFood(localeCode, foodId);
    if (!sourceFood)
      throw new NotFoundError();

    const food = await db.foods.transaction(async (transaction) => {
      const food = await Food.create(
        {
          ...pick(sourceFood, ['code', 'localeId', 'englishName', 'name', 'simpleName', 'foodGroupId', 'altNames', 'tags', 'excludeTags']),
          ...input,
          simpleName: toSimpleName(input.name)!,
          version: randomUUID(),
        },
        { transaction },
      );

      const promises: Promise<any>[] = [];

      if (sourceFood.parentCategories?.length) {
        const categories = sourceFood.parentCategories.map(({ id }) => id);
        promises.push(food.$set('parentCategories', categories, { transaction }));
      }

      if (sourceFood.nutrientRecords?.length) {
        const nutrientRecords = sourceFood.nutrientRecords.map(({ id }) => id);
        promises.push(food.$set('nutrientRecords', nutrientRecords, { transaction }));
      }

      if (sourceFood.associatedFoods?.length) {
        const associatedFoods = sourceFood.associatedFoods!.map(psm => ({
          ...pick(psm, [
            'associatedFoodCode',
            'associatedCategoryCode',
            'text',
            'linkAsMain',
            'multiple',
            'genericName',
            'orderBy',
          ]),
          foodId: food.id,
        }));
        promises.push(AssociatedFood.bulkCreate(associatedFoods, { transaction }));
      }

      if (sourceFood.portionSizeMethods?.length) {
        promises.push(
          ...sourceFood.portionSizeMethods.map(psm =>
            FoodPortionSizeMethod.create(
              {
                ...pick(psm, [
                  'method',
                  'description',
                  'useForRecipes',
                  'conversionFactor',
                  'orderBy',
                  'parameters',
                ]),
                foodId: food.id,
              },
              { transaction },
            ),
          ),
        );
      }

      await Promise.all(promises);

      return food;
    });

    return (await getFood(localeCode, food.id))!;
  };

  const deleteFood = async (localeCode: string, foodId: string) => {
    const food = await Food.findOne({
      attributes: ['id', 'code'],
      where: { id: foodId, localeId: localeCode },
    });
    if (!food)
      throw new NotFoundError();

    await food.destroy();
  };

  return {
    browseFoods,
    getFood,
    getFoodByCode,
    createFood,
    updateFood,
    copyFood,
    deleteFood,
  };
}

export default adminFoodService;

export type AdminFoodService = ReturnType<typeof adminFoodService>;
