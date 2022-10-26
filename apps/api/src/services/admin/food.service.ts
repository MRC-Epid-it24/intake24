import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { FoodInput } from '@intake24/common/types/http/admin';
import type {
  FoodLocalAttributes,
  FoodPortionSizeMethodUpdateAttributes,
  PortionSizeMethodParameterUpdateAttributes,
} from '@intake24/common/types/models';
import type { FindOptions, PaginateQuery, Transaction } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import {
  Food,
  FoodLocal,
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

      const ops = ['name', '$main.name$'].map((column) => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return FoodLocal.paginate({ query, ...options });
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
            { association: 'foodGroup' },
            { association: 'brands', where, required: false, separate: true },
            {
              association: 'parentCategories',
              through: { attributes: [] },
              include: [{ association: 'locals', attributes: ['name'], where }],
            },
          ],
        },
        {
          association: 'associatedFoods',
          required: false,
          separate: true,
          where: { localeId: localeCode },
          include: [{ association: 'associatedCategory' }, { association: 'associatedFood' }],
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
    inputs: PortionSizeMethodParameterUpdateAttributes[],
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
    inputs: FoodPortionSizeMethodUpdateAttributes[],
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

          await match.update(rest, { transaction });
          await updateParameters(match.id, match.parameters, parameters, { transaction });
          continue;
        }
      }

      const newMethod = await FoodPortionSizeMethod.create(
        { ...rest, foodLocalId },
        { transaction }
      );
      newMethods.push(newMethod);

      if (parameters.length) {
        const records = parameters.map((item) => ({
          ...item,
          portionSizeMethodId: newMethod.id,
        }));
        await FoodPortionSizeMethodParameter.bulkCreate(records, { transaction });
      }
    }

    return [...methods, ...newMethods];
  };

  const updateFood = async (foodLocalId: string, localeId: string, input: FoodInput) => {
    const foodLocal = await getFood(foodLocalId, localeId);
    if (!foodLocal) throw new NotFoundError();

    const { main, portionSizeMethods } = foodLocal;
    if (
      !main ||
      !portionSizeMethods ||
      portionSizeMethods.some((psm) => psm.parameters === undefined)
    )
      throw new NotFoundError();

    const { attributes } = main;
    if (!attributes) throw new NotFoundError();

    const categories = (input.main.parentCategories ?? []).map(({ code }) => code);
    const nutrientRecords = (input.nutrientRecords ?? []).map(({ id }) => id);

    await db.foods.transaction(async (transaction) => {
      await Promise.all([
        foodLocal.update(pick(input, ['name']), { transaction }),
        main.update(pick(input.main, ['name', 'foodGroupId']), { transaction }),
        attributes.update(
          pick(input.main.attributes, [
            'sameAsBeforeOption',
            'readyMealOption',
            'reasonableAmount',
            'useInRecipes',
          ]),
          { transaction }
        ),
        main.$set('parentCategories', categories, { transaction }),
        foodLocal.$set('nutrientRecords', nutrientRecords, { transaction }),
        updatePortionSizeMethods(foodLocalId, portionSizeMethods, input.portionSizeMethods, {
          transaction,
        }),
      ]);

      if (main.code !== input.main.code)
        await Food.update({ code: input.main.code }, { where: { code: main.code }, transaction });
    });

    return getFood(foodLocalId, localeId);
  };

  return {
    browseFoods,
    getFood,
    updateFood,
  };
};

export default adminFoodService;

export type AdminFoodService = ReturnType<typeof adminFoodService>;
