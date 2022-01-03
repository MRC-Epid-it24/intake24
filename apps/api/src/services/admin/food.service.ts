import { pick } from 'lodash';
import { FindOptions, Op } from 'sequelize';
import {
  Brand,
  Food,
  FoodAttribute,
  FoodGroup,
  FoodLocal,
  FoodPortionSizeMethod,
  FoodPortionSizeMethodParameter,
  PaginateQuery,
} from '@api/db';
import { NotFoundError } from '@api/http/errors';
import { FoodInput } from '@common/types/http/admin';
import { FoodLocalAttributes } from '@common/types/models';

const adminFoodService = () => {
  const browseFoods = async (localeId: string, query: PaginateQuery) => {
    const options: FindOptions<FoodLocalAttributes> = {
      where: { localeId },
      include: [{ model: Food }],
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

  const getFood = async (foodId: string, localeId?: string) => {
    const where = localeId ? { localeId } : {};

    return FoodLocal.findOne({
      where: { ...where, id: foodId },
      include: [
        {
          model: Food,
          required: true,
          include: [
            { model: FoodAttribute },
            { model: FoodGroup },
            { model: Brand, where, required: false, separate: true },
            {
              association: 'parentCategories',
              through: { attributes: [] },
              include: [{ association: 'locals', attributes: ['name'], where }],
            },
          ],
        },
        {
          model: FoodPortionSizeMethod,
          separate: true,
          include: [{ model: FoodPortionSizeMethodParameter, separate: true }],
        },
      ],
    });
  };

  const updateFood = async (foodId: string, localeId: string, input: FoodInput) => {
    const foodLocal = await getFood(foodId, localeId);
    if (!foodLocal) throw new NotFoundError();

    const { main } = foodLocal;
    if (!main) throw new NotFoundError();

    const { attributes } = main;
    if (!attributes) throw new NotFoundError();

    const categories = (input.main.parentCategories ?? []).map((cat) => cat.code);

    await Promise.all([
      foodLocal.update(pick(input, ['name'])),
      main.update(pick(input.main, ['name', 'foodGroupId'])),
      attributes.update(
        pick(input.main.attributes, [
          'sameAsBeforeOption',
          'readyMealOption',
          'reasonableAmount',
          'useInRecipes',
        ])
      ),
      main.$set('parentCategories', categories),
    ]);

    if (main.code !== input.main.code)
      await Food.update({ code: input.main.code }, { where: { code: main.code } });

    return getFood(foodId, localeId);
  };

  return {
    browseFoods,
    getFood,
    updateFood,
  };
};

export default adminFoodService;

export type AdminFoodService = ReturnType<typeof adminFoodService>;
