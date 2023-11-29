import { randomUUID } from 'node:crypto';

import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  FoodInput,
  FoodLocalCopyInput,
  FoodLocalInput,
} from '@intake24/common/types/http/admin';
import type {
  FindOptions,
  FoodLocalAttributes,
  FoodPortionSizeMethodParameterCreationAttributes,
  PaginateQuery,
  Transaction,
} from '@intake24/db';
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
  FoodPortionSizeMethodParameter,
  Op,
} from '@intake24/db';

const adminFoodService = ({ db }: Pick<IoC, 'db'>) => {
  const browseFoods = async (localeId: string, query: PaginateQuery) => {
    const options: FindOptions<FoodLocalAttributes> = {
      where: { localeId },
      include: [{ association: 'main', required: true }],
    };
    const { search } = query;

    if (search) {
      const op =
        FoodLocal.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['foodCode', 'name', '$main.name$'].map((column) => ({ [column]: op }));

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
          include: [
            {
              association: 'parameters',
              include: [
                {
                  association: 'asServedSet',
                  where: {
                    $method$: 'as-served',
                    '$parameters.name$': ['serving-image-set', 'leftovers-image-set'],
                  },
                  required: false,
                  include: [{ association: 'selectionImage', attributes: ['path'] }],
                },
                {
                  association: 'drinkwareSet',
                  where: { $method$: 'drink-scale', '$parameters.name$': ['drinkware-id'] },
                  required: false,
                  include: [
                    {
                      association: 'imageMap',
                      include: [{ association: 'baseImage', attributes: ['path'] }],
                    },
                  ],
                },
                {
                  association: 'guideImage',
                  where: { $method$: 'guide-image', '$parameters.name$': ['guide-image-id'] },
                  required: false,
                  include: [{ association: 'selectionImage', attributes: ['path'] }],
                },
                /* {
                  association: 'standardUnit',
                  attributes: ['id', 'estimateIn', 'howMany'],
                  where: { '$parameters.name$': { [Op.endsWith]: '-name' } },
                  required: false,
                }, */
              ],
            },
          ],
          order: [['orderBy', 'ASC']],
        },
        { association: 'nutrientRecords', through: { attributes: [] } },
      ],
    });
  };

  const updateParameters = async (
    portionSizeMethodId: string,
    parameters: FoodPortionSizeMethodParameter[],
    inputs: FoodPortionSizeMethodParameterCreationAttributes[],
    { transaction }: { transaction: Transaction }
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await FoodPortionSizeMethodParameter.destroy({
      where: { portionSizeMethodId, id: { [Op.notIn]: ids } },
      transaction,
    });

    if (!inputs.length) return [];

    const newParameters: FoodPortionSizeMethodParameter[] = [];

    for (const input of inputs) {
      const { id, ...rest } = input;

      if (id) {
        const match = parameters.find((parameter) => parameter.id === id);
        if (match) {
          await match.update(rest, { transaction });
          continue;
        }
      }

      const newParameter = await FoodPortionSizeMethodParameter.create(
        { ...rest, portionSizeMethodId },
        { transaction }
      );
      newParameters.push(newParameter);
    }

    return [...parameters, ...newParameters];
  };

  const updatePortionSizeMethods = async (
    foodLocalId: string,
    methods: FoodPortionSizeMethod[],
    inputs: FoodLocalInput['portionSizeMethods'],
    { transaction }: { transaction: Transaction }
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await FoodPortionSizeMethod.destroy({
      where: { foodLocalId, id: { [Op.notIn]: ids } },
      transaction,
    });

    if (!inputs.length) return [];

    const newMethods: FoodPortionSizeMethod[] = [];

    for (const input of inputs) {
      const { id, parameters, ...rest } = input;

      if (id) {
        const match = methods.find((method) => method.id === id);
        if (match) {
          if (!match.parameters) await match.reload({ include: [{ association: 'parameters' }] });
          if (!match.parameters) throw new NotFoundError();

          await Promise.all([
            match.update(rest, { transaction }),
            updateParameters(match.id, match.parameters, parameters, { transaction }),
          ]);
          continue;
        }
      }

      const newMethod = await FoodPortionSizeMethod.create(
        { ...rest, foodLocalId },
        { transaction }
      );
      newMethods.push(newMethod);

      if (parameters.length) {
        const records = parameters.map((item) => ({ ...item, portionSizeMethodId: newMethod.id }));
        await FoodPortionSizeMethodParameter.bulkCreate(records, { transaction });
      }
    }

    return [...methods, ...newMethods];
  };

  const updateAssociatedFoods = async (
    foodCode: string,
    localeId: string,
    foods: AssociatedFood[],
    inputs: FoodLocalInput['associatedFoods'],
    { transaction }: { transaction: Transaction }
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await AssociatedFood.destroy({
      where: { foodCode, localeId, id: { [Op.notIn]: ids } },
      transaction,
    });

    if (!inputs.length) return [];

    const newFoods: AssociatedFood[] = [];

    for (const input of inputs) {
      const { id, ...rest } = input;

      if (id) {
        const match = foods.find((food) => food.id === id);
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
        await FoodAttribute.create({ foodCode: main.code }, { transaction });

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
          { transaction }
        ),
        FoodLocalList.create({ foodCode: main.code, localeId: localeCode }, { transaction }),
      ]);

      return foodLocal;
    });

    return (await getFood(foodLocal.id, localeCode))!;
  };

  const updateFood = async (foodLocalId: string, localeCode: string, input: FoodLocalInput) => {
    const foodLocal = await getFood(foodLocalId, localeCode);
    if (!foodLocal) throw new NotFoundError();

    const { main, portionSizeMethods, associatedFoods } = foodLocal;
    if (
      !main ||
      !associatedFoods ||
      !portionSizeMethods ||
      portionSizeMethods.some((psm) => psm.parameters === undefined)
    )
      throw new NotFoundError();

    const { attributes } = main;
    if (!attributes) throw new NotFoundError();

    await db.foods.transaction(async (transaction) => {
      const nutrientRecords = input.nutrientRecords.map(({ id }) => id);

      const promises: Promise<any>[] = [
        foodLocal.update(pick(input, ['name']), { transaction }),
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

        if (input.main.parentCategories) {
          const categories = input.main.parentCategories.map(({ code }) => code);
          promises.push(main.$set('parentCategories', categories, { transaction }));
        }

        if (input.main.attributes) {
          promises.push(
            attributes.update(
              pick(input.main.attributes, [
                'sameAsBeforeOption',
                'readyMealOption',
                'reasonableAmount',
                'useInRecipes',
              ]),
              { transaction }
            )
          );
        }
      }

      await Promise.all(promises);

      if (input.main?.code && input.main.code !== main.code)
        await Food.update({ code: input.main.code }, { where: { code: main.code }, transaction });
    });

    return getFood(foodLocalId, localeCode);
  };

  const copyFood = async (foodLocalId: string, localeCode: string, input: FoodLocalCopyInput) => {
    const sourceFoodLocal = await getFood(foodLocalId, localeCode);
    if (!sourceFoodLocal) throw new NotFoundError();

    const foodLocal = await db.foods.transaction(async (transaction) => {
      const food = await Food.create(
        {
          ...pick(sourceFoodLocal.main!, ['code', 'name', 'foodGroupId']),
          ...input,
          version: randomUUID(),
        },
        { transaction }
      );
      const foodLocal = await FoodLocal.create(
        {
          ...pick(sourceFoodLocal, ['localeId', 'name', 'simpleName']),
          foodCode: food.code,
          name: input.name,
          version: randomUUID(),
        },
        { transaction }
      );

      const promises: Promise<any>[] = [
        FoodAttribute.create(
          {
            ...pick(sourceFoodLocal.main!.attributes!, [
              'sameAsBeforeOption',
              'readyMealOption',
              'reasonableAmount',
              'useInRecipes',
            ]),
            foodCode: food.code,
          },
          { transaction }
        ),
      ];

      if (sourceFoodLocal.main?.parentCategories?.length) {
        const categories = sourceFoodLocal.main.parentCategories.map(({ code }) => code);
        promises.push(food.$set('parentCategories', categories, { transaction }));
      }

      if (sourceFoodLocal.nutrientRecords?.length) {
        const nutrientRecords = sourceFoodLocal.nutrientRecords.map(({ id }) => id);
        promises.push(foodLocal.$set('nutrientRecords', nutrientRecords, { transaction }));
      }

      if (sourceFoodLocal.associatedFoods?.length) {
        const associatedFoods = sourceFoodLocal.associatedFoods!.map((psm) => ({
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
        for (const psm of sourceFoodLocal.portionSizeMethods) {
          const method = await FoodPortionSizeMethod.create(
            {
              ...pick(psm, [
                'method',
                'description',
                'imageUrl',
                'useForRecipes',
                'conversionFactor',
                'orderBy',
              ]),
              foodLocalId: foodLocal.id,
            },
            { transaction }
          );

          if (!psm.parameters?.length) continue;

          const parameters = psm.parameters.map((parameter) => ({
            ...pick(parameter, ['name', 'value']),
            portionSizeMethodId: method.id,
          }));

          promises.push(FoodPortionSizeMethodParameter.bulkCreate(parameters, { transaction }));
        }
      }

      await Promise.all(promises);

      return foodLocal;
    });

    return (await getFood(foodLocal.id, localeCode))!;
  };

  const deleteFood = async (foodLocalId: string, localeCode: string) => {
    const foodLocal = await FoodLocal.findOne({ where: { id: foodLocalId, localeId: localeCode } });
    if (!foodLocal) throw new NotFoundError();

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
};

export default adminFoodService;

export type AdminFoodService = ReturnType<typeof adminFoodService>;
