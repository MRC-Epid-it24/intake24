import { randomUUID } from 'node:crypto';

import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  FoodInput,
  FoodLocalCopyInput,
  FoodLocalInput,
} from '@intake24/common/types/http/admin';
import type { FindOptions, FoodLocalAttributes, PaginateQuery, Transaction } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { foodsResponse } from '@intake24/api/http/responses/admin';
import { toSimpleName } from '@intake24/api/util';
import {
  AssociatedFood,
  Food,
  FoodAttribute,
  FoodLocal,
  FoodLocalList,
  FoodPortionSizeMethod,
  Op,
} from '@intake24/db';

function adminFoodService({ cache, db }: Pick<IoC, 'cache' | 'db'>) {
  const browseFoods = async (localeId: string, query: PaginateQuery) => {
    const options: FindOptions<FoodLocalAttributes> = {
      where: { localeId },
      include: [{ association: 'main', required: true }],
    };
    const { search } = query;

    if (search) {
      const op
        = FoodLocal.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['foodCode', 'name', '$main.name$'].map(column => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return FoodLocal.paginate({ query, transform: foodsResponse, ...options });
  };

  const getFood = async (foodLocalId: string, localeCode?: string) => {
    const where = localeCode ? { localeId: localeCode } : {};

    return FoodLocal.findOne({
      where: { ...where, id: foodLocalId },
      include: [
        {
          association: 'main',
          required: true,
          include: [
            { association: 'attributes' },
            { association: 'brands', where, required: false, separate: true },
            { association: 'foodGroup' },
            { association: 'locales', through: { attributes: [] } },
            {
              association: 'parentCategories',
              through: { attributes: [] },
              include: [{ association: 'locals', attributes: ['id', 'name'], where }],
            },
          ],
        },
        {
          association: 'associatedFoods',
          required: false,
          separate: true,
          where: { localeId: localeCode },
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

  const updatePortionSizeMethods = async (
    foodLocalId: string,
    methods: FoodPortionSizeMethod[],
    inputs: FoodLocalInput['portionSizeMethods'],
    { transaction }: { transaction: Transaction },
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await FoodPortionSizeMethod.destroy({
      where: { foodLocalId, id: { [Op.notIn]: ids } },
      transaction,
    });

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

      const newMethod = await FoodPortionSizeMethod.create(
        { ...rest, foodLocalId },
        { transaction },
      );
      newMethods.push(newMethod);
    }

    return [...methods, ...newMethods];
  };

  const updateAssociatedFoods = async (
    foodCode: string,
    localeId: string,
    foods: AssociatedFood[],
    inputs: FoodLocalInput['associatedFoods'],
    { transaction }: { transaction: Transaction },
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await AssociatedFood.destroy({
      where: { foodCode, localeId, id: { [Op.notIn]: ids } },
      transaction,
    });

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

      const newFood = await AssociatedFood.create({ ...rest, foodCode, localeId }, { transaction });
      newFoods.push(newFood);
    }

    return [...foods, ...newFoods];
  };

  const createFood = async (localeCode: string, input: FoodInput) => {
    const foodLocal = await db.foods.transaction(async (transaction) => {
      let main = await Food.findByPk(input.code, { transaction });
      if (!main) {
        main = await Food.create({ ...input, version: randomUUID() }, { transaction });

        if (input.parentCategories?.length) {
          const categories = input.parentCategories.map(({ code }) => code);
          await main.$set('parentCategories', categories, { transaction });
        }
      }

      const [foodLocal] = await Promise.all([
        FoodLocal.create(
          {
            foodCode: main.code,
            localeId: localeCode,
            name: main.name,
            simpleName: toSimpleName(main.name),
            version: randomUUID(),
          },
          { transaction },
        ),
        main.$add('locales', localeCode, { transaction }),
      ]);

      return foodLocal;
    });

    return (await getFood(foodLocal.id, localeCode))!;
  };

  const updateFood = async (foodLocalId: string, localeCode: string, input: FoodLocalInput) => {
    const foodLocal = await getFood(foodLocalId, localeCode);
    if (!foodLocal)
      throw new NotFoundError();

    const { main, portionSizeMethods, associatedFoods } = foodLocal;
    if (!main || !associatedFoods || !portionSizeMethods)
      throw new NotFoundError();

    await db.foods.transaction(async (transaction) => {
      const nutrientRecords = input.nutrientRecords.map(({ id }) => id);

      const promises: Promise<any>[] = [
        foodLocal.update(pick(input, ['name', 'altNames', 'tags']), { transaction }),
        foodLocal.$set('nutrientRecords', nutrientRecords, { transaction }),
        updatePortionSizeMethods(foodLocalId, portionSizeMethods, input.portionSizeMethods, {
          transaction,
        }),
        updateAssociatedFoods(main.code, localeCode, associatedFoods, input.associatedFoods, {
          transaction,
        }),
      ];

      if (input.main) {
        promises.push(main.update(pick(input.main, ['name', 'foodGroupId']), { transaction }));

        if (input.main.locales) {
          const locales = input.main.locales.map(({ id }) => id);
          promises.push(main.$set('locales', locales, { transaction }));
        }
        if (input.main.parentCategories) {
          const categories = input.main.parentCategories.map(({ code }) => code);
          promises.push(main.$set('parentCategories', categories, { transaction }));
        }

        if (input.main.attributes) {
          const attributesInput = pick(input.main.attributes, ['sameAsBeforeOption', 'readyMealOption', 'reasonableAmount', 'useInRecipes']);
          if (Object.values(attributesInput).every(item => item === null)) {
            if (main.attributes)
              promises.push(main.attributes.destroy({ transaction }));
          }
          else {
            promises.push(
              main.attributes
                ? main.attributes.update(attributesInput, { transaction })
                : FoodAttribute.create({ foodCode: main.code, ...attributesInput }, { transaction }),
            );
          }
        }
      }

      await Promise.all(promises);

      if (input.main?.code && input.main.code !== main.code)
        await Food.update({ code: input.main.code }, { where: { code: main.code }, transaction });
    });

    await cache.forget([
      `food-attributes:${input.main?.code}`,
      `food-entry:${localeCode}:${input.main?.code}`,
      `food-all-categories:${input.main?.code}`,
      `food-parent-categories:${input.main?.code}`,
    ]);

    return (await getFood(foodLocalId, localeCode))!;
  };

  const copyFood = async (foodLocalId: string, localeCode: string, input: FoodLocalCopyInput) => {
    const sourceFoodLocal = await getFood(foodLocalId, localeCode);
    if (!sourceFoodLocal)
      throw new NotFoundError();

    const foodLocal = await db.foods.transaction(async (transaction) => {
      const food = await Food.create(
        {
          ...pick(sourceFoodLocal.main!, ['code', 'name', 'foodGroupId']),
          ...input,
          version: randomUUID(),
        },
        { transaction },
      );
      const foodLocal = await FoodLocal.create(
        {
          ...pick(sourceFoodLocal, ['localeId', 'name', 'simpleName', 'altNames', 'tags']),
          foodCode: food.code,
          name: input.name,
          version: randomUUID(),
        },
        { transaction },
      );

      const promises: Promise<any>[] = [];

      if (sourceFoodLocal.main?.attributes) {
        promises.push(
          FoodAttribute.create(
            {
              ...pick(sourceFoodLocal.main.attributes, ['sameAsBeforeOption', 'readyMealOption', 'reasonableAmount', 'useInRecipes']),
              foodCode: food.code,
            },
            { transaction },
          ),
        );
      }

      if (sourceFoodLocal.main?.locales?.length) {
        const locales = sourceFoodLocal.main.locales.map(({ id }) => id);
        promises.push(food.$set('locales', locales, { transaction }));
      }

      if (sourceFoodLocal.main?.parentCategories?.length) {
        const categories = sourceFoodLocal.main.parentCategories.map(({ code }) => code);
        promises.push(food.$set('parentCategories', categories, { transaction }));
      }

      if (sourceFoodLocal.nutrientRecords?.length) {
        const nutrientRecords = sourceFoodLocal.nutrientRecords.map(({ id }) => id);
        promises.push(foodLocal.$set('nutrientRecords', nutrientRecords, { transaction }));
      }

      if (sourceFoodLocal.associatedFoods?.length) {
        const associatedFoods = sourceFoodLocal.associatedFoods!.map(psm => ({
          ...pick(psm, [
            'associatedFoodCode',
            'associatedCategoryCode',
            'text',
            'linkAsMain',
            'multiple',
            'genericName',
            'orderBy',
          ]),
          foodCode: food.code,
          localeId: foodLocal.localeId,
        }));
        promises.push(AssociatedFood.bulkCreate(associatedFoods, { transaction }));
      }

      if (sourceFoodLocal.portionSizeMethods?.length) {
        promises.push(
          ...sourceFoodLocal.portionSizeMethods.map(psm =>
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
                foodLocalId: foodLocal.id,
              },
              { transaction },
            ),
          ),
        );
      }

      await Promise.all(promises);

      return foodLocal;
    });

    return (await getFood(foodLocal.id, localeCode))!;
  };

  const deleteFood = async (foodLocalId: string, localeCode: string) => {
    const foodLocal = await FoodLocal.findOne({
      attributes: ['id', 'foodCode'],
      where: { id: foodLocalId, localeId: localeCode },
    });
    if (!foodLocal)
      throw new NotFoundError();

    await Promise.all([
      foodLocal.destroy(),
      FoodLocalList.destroy({ where: { foodCode: foodLocal.foodCode, localeId: localeCode } }),
    ]);
  };

  return {
    browseFoods,
    getFood,
    createFood,
    updateFood,
    copyFood,
    deleteFood,
  };
}

export default adminFoodService;

export type AdminFoodService = ReturnType<typeof adminFoodService>;
