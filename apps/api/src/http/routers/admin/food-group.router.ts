import type { WhereOptions } from 'sequelize';
import { initServer } from '@ts-rest/express';
import { Op } from 'sequelize';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { unique } from '@intake24/api/http/rules';
import { contract } from '@intake24/common/contracts';
import { FoodGroup } from '@intake24/db';

async function uniqueMiddleware(value: any, { foodGroupId }: { foodGroupId?: string } = {}) {
  const where: WhereOptions = foodGroupId ? { id: { [Op.ne]: foodGroupId } } : {};

  if (!(await unique({ model: FoodGroup, condition: { field: 'name', value }, options: { where } }))) {
    throw ValidationError.from({ path: 'name', i18n: { type: 'unique._' } });
  }
}

export function foodGroup() {
  return initServer().router(contract.admin.foodGroup, {
    browse: {
      middleware: [permission('food-groups', 'food-groups:browse')],
      handler: async ({ query }) => {
        const foodGroups = await FoodGroup.paginate({
          query,
          columns: ['name'],
          order: [['id', 'ASC']],
        });

        return { status: 200, body: foodGroups };
      },
    },
    store: {
      middleware: [permission('food-groups', 'food-groups:create')],
      handler: async ({ body }) => {
        await uniqueMiddleware(body.name);

        const foodGroup = await FoodGroup.create(body);

        return { status: 201, body: foodGroup };
      },
    },
    read: {
      middleware: [permission('food-groups', 'food-groups:read')],
      handler: async ({ params: { foodGroupId } }) => {
        const foodGroup = await FoodGroup.findByPk(foodGroupId);
        if (!foodGroup)
          throw new NotFoundError();

        return { status: 200, body: foodGroup };
      },
    },
    update: {
      middleware: [permission('food-groups', 'food-groups:edit')],
      handler: async ({ body, params: { foodGroupId } }) => {
        await uniqueMiddleware(body.name, { foodGroupId });

        const foodGroup = await FoodGroup.findByPk(foodGroupId);
        if (!foodGroup)
          throw new NotFoundError();

        await foodGroup.update(body);

        return { status: 200, body: foodGroup };
      },
    },
    destroy: {
      middleware: [permission('food-groups', 'food-groups:delete')],
      handler: async ({ params: { foodGroupId } }) => {
        const foodGroup = await FoodGroup.findByPk(foodGroupId, {
          attributes: ['id'],
          include: [{ association: 'foods', attributes: ['code'] }],
        });
        if (!foodGroup)
          throw new NotFoundError();

        if (!foodGroup.foods || foodGroup.foods.length) {
          throw new ForbiddenError(
            'Food group cannot be deleted. There are foods using this food group.',
          );
        }

        await foodGroup.destroy();

        return { status: 204, body: undefined };
      },
    },
  });
}
