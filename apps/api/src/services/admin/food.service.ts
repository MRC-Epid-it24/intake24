import { FindOptions, Op } from 'sequelize';
import {
  Brand,
  Food,
  FoodAttribute,
  FoodGroup,
  FoodLocal,
  FoodPortionSizeMethod,
  FoodPortionSizeMethodParameter,
} from '@api/db/models/foods';
import { PaginateQuery } from '@api/db/models/model';
import { NotFoundError } from '@api/http/errors';

const adminFoodService = () => {
  const browseFoods = async (localeId: string, query: PaginateQuery) => {
    const options: FindOptions = { where: { localeId }, include: [{ model: Food }] };
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

  return {
    browseFoods,
    getFood,
  };
};

export default adminFoodService;

export type AdminFoodService = ReturnType<typeof adminFoodService>;
