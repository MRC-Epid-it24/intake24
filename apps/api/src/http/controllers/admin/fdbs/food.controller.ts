import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { FoodLocalEntry, FoodsResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { FoodLocal, SystemLocale } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const adminFoodController = ({ adminFoodService }: Pick<IoC, 'adminFoodService'>) => {
  const browse = async (
    req: Request<{ localeId: string }, any, any, PaginateQuery>,
    res: Response<FoodsResponse>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(
      SystemLocale,
      'food-list',
      req as Request<{ localeId: string }>
    );

    const foods = await adminFoodService.browseFoods(
      code,
      pick(req.query, ['page', 'limit', 'sort', 'search'])
    );

    res.json(foods);
  };

  const store = async (
    req: Request<{ foodId: string; localeId: string }>,
    res: Response
  ): Promise<void> => {
    await getAndCheckAccess(SystemLocale, 'food-list', req);

    res.json();
  };

  const read = async (
    req: Request<{ foodId: string; localeId: string }>,
    res: Response<FoodLocalEntry>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);
    const { foodId } = req.params;

    const foodLocal = await adminFoodService.getFood(foodId, code);
    if (!foodLocal) throw new NotFoundError();

    res.json(foodLocal);
  };

  const update = async (
    req: Request<{ foodId: string; localeId: string }>,
    res: Response<FoodLocalEntry>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);
    const { foodId } = req.params;

    const foodLocal = await adminFoodService.updateFood(foodId, code, req.body);
    if (!foodLocal) throw new NotFoundError();

    res.json(foodLocal);
  };

  const destroy = async (
    req: Request<{ foodId: string; localeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);
    const { foodId } = req.params;

    const foodLocal = await FoodLocal.findOne({ where: { id: foodId, localeId: code } });
    if (!foodLocal) throw new NotFoundError();

    await foodLocal.destroy();

    res.json();
  };

  return {
    browse,
    store,
    read,
    update,
    destroy,
  };
};

export default adminFoodController;

export type AdminFoodController = ReturnType<typeof adminFoodController>;