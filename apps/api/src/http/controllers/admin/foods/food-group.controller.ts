import type { Request, Response } from 'express';
import { pick } from 'lodash';
import type { FoodGroupEntry, FoodGroupsResponse } from '@intake24/common/types/http/admin';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import type { PaginateQuery } from '@intake24/db';
import { Food, FoodGroup } from '@intake24/db';
import type { Controller, CrudActions } from '../../controller';

export type AdminFoodGroupController = Controller<CrudActions>;

export default (): AdminFoodGroupController => {
  const entry = async (req: Request, res: Response<FoodGroupEntry>): Promise<void> => {
    const { foodGroupId } = req.params;

    const foodGroup = await FoodGroup.findByPk(foodGroupId);
    if (!foodGroup) throw new NotFoundError();

    res.json(foodGroup);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<FoodGroupsResponse>
  ): Promise<void> => {
    const foodGroups = await FoodGroup.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      order: [['id', 'ASC']],
    });

    res.json(foodGroups);
  };

  const store = async (req: Request, res: Response<FoodGroupEntry>): Promise<void> => {
    const { name } = req.body;

    const foodGroup = await FoodGroup.create({ name });

    res.status(201).json(foodGroup);
  };

  const read = async (
    req: Request<{ foodGroupId: string }>,
    res: Response<FoodGroupEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ foodGroupId: string }>,
    res: Response<FoodGroupEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ foodGroupId: string }>,
    res: Response<FoodGroupEntry>
  ): Promise<void> => {
    const {
      params: { foodGroupId },
      body: { name },
    } = req;

    const foodGroup = await FoodGroup.findByPk(foodGroupId);
    if (!foodGroup) throw new NotFoundError();

    await foodGroup.update({ name });

    res.json(foodGroup);
  };

  const destroy = async (
    req: Request<{ foodGroupId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { foodGroupId } = req.params;

    const foodGroup = await FoodGroup.findByPk(foodGroupId, { include: [{ model: Food }] });
    if (!foodGroup) throw new NotFoundError();

    if (!foodGroup.foods || foodGroup.foods.length)
      throw new ForbiddenError(
        'Food group cannot be deleted. There are foods using this food group.'
      );

    await foodGroup.destroy();
    res.status(204).json();
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
  };
};
