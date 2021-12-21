import { FindOptions, Op } from 'sequelize';
import {
  Food,
  FoodLocal,
  FoodPortionSizeMethod,
  FoodPortionSizeMethodParameter,
} from '@api/db/models/foods';
import { PaginateQuery } from '@api/db/models/model';

const adminFoodService = () => {
  const browseFoods = async (localeId: string, query: PaginateQuery) => {
    const options: FindOptions = { where: { localeId }, include: [{ model: Food }] };
    const { search } = query;

    if (search) {
      const op =
        FoodLocal.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['name', '$food.name$'].map((column) => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return FoodLocal.paginate({ query, ...options });
  };

  const getFood = async (foodId: string, localeId?: string) =>
    FoodLocal.findOne({
      where: localeId ? { id: foodId, localeId } : { id: foodId },
      include: [
        {
          model: Food,
          include: [
            { association: 'attributes' },
            { association: 'brands', where: { localeId }, required: false, separate: true },
            { association: 'categories', through: { attributes: [] } },
          ],
        },
        {
          model: FoodPortionSizeMethod,
          separate: true,
          include: [{ model: FoodPortionSizeMethodParameter, separate: true }],
        },
      ],
    });

  return {
    browseFoods,
    getFood,
  };
};

export default adminFoodService;

export type AdminFoodService = ReturnType<typeof adminFoodService>;
