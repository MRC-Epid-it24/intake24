import type { Request, Response } from 'express';
import { pick } from 'lodash';

import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type {
  FoodInput,
  FoodLocalEntry,
  FoodLocalInput,
  FoodsResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { FoodLocal, SystemLocale } from '@intake24/db';

function adminFoodController({
  adminFoodService,
  cachedParentCategoriesService,
}: Pick<IoC, 'adminFoodService' | 'cachedParentCategoriesService'>) {
  const browse = async (
    req: Request<{ localeId: string }, any, any, PaginateQuery>,
    res: Response<FoodsResponse>,
  ): Promise<void> => {
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const { code } = await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
      attributes: ['code'],
      where: { id: localeId },
    });

    const foods = await adminFoodService.browseFoods(
      code,
      pick(req.query, ['page', 'limit', 'sort', 'search']),
    );

    res.json(foods);
  };

  const store = async (
    req: Request<{ localeId: string }, any, FoodInput>,
    res: Response,
  ): Promise<void> => {
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const { code } = await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
      attributes: ['code'],
      where: { id: localeId },
    });

    const foodLocal = await adminFoodService.createFood(code, req.body);

    res.json(foodLocal);
  };

  const read = async (
    req: Request<{ foodId: string; localeId: string }>,
    res: Response<FoodLocalEntry>,
  ): Promise<void> => {
    const { foodId, localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const { code } = await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
      attributes: ['code'],
      where: { id: localeId },
    });

    const foodLocal = await adminFoodService.getFood(foodId, code);
    if (!foodLocal)
      throw new NotFoundError();

    res.json(foodLocal);
  };

  const readByCode = async (
    req: Request<{ foodCode: string; localeId: string }>,
    res: Response<FoodLocalEntry>,
  ): Promise<void> => {
    const { foodCode, localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const { code } = await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
      attributes: ['code'],
      where: { id: localeId },
    });

    const foodLocal = await adminFoodService.getFoodByCode(foodCode, code);
    if (!foodLocal)
      throw new NotFoundError();

    res.json(foodLocal);
  };

  const update = async (
    req: Request<{ foodId: string; localeId: string }, any, FoodLocalInput>,
    res: Response<FoodLocalEntry>,
  ): Promise<void> => {
    const { foodId, localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const { code } = await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
      attributes: ['code'],
      where: { id: localeId },
    });

    const { main, ...rest } = req.body;

    const canUpdateMain = !!(
      main?.code
      && ((await aclService.hasPermission('locales:food-list'))
        || (await FoodLocal.count({ where: { foodCode: main.code } })) === 1)
    );

    const foodLocal = await adminFoodService.updateFood(
      foodId,
      code,
      canUpdateMain ? req.body : rest,
    );

    res.json(foodLocal);
  };

  const destroy = async (
    req: Request<{ foodId: string; localeId: string }>,
    res: Response<undefined>,
  ): Promise<void> => {
    const { foodId, localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const { code } = await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
      attributes: ['code'],
      where: { id: localeId },
    });

    await adminFoodService.deleteFood(foodId, code);

    res.status(204).json();
  };

  const copy = async (
    req: Request<{ foodId: string; localeId: string }>,
    res: Response<FoodLocalEntry>,
  ): Promise<void> => {
    const { foodId, localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const { code } = await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
      attributes: ['code'],
      where: { id: localeId },
    });

    if (localeId !== req.body.localeId) {
      await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
        attributes: ['code'],
        where: { id: req.body.localeId },
      });
    }

    const foodLocal = await adminFoodService.copyFood({ foodId, localeId, localeCode: code }, req.body);

    res.json(foodLocal);
  };

  const categories = async (
    req: Request,
    res: Response<{ categories: string[] }>,
  ): Promise<void> => {
    const { foodId, localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const { code } = await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
      attributes: ['code'],
      where: { id: localeId },
    });

    const foodLocal = await FoodLocal.findOne({
      attributes: ['id', 'foodCode'],
      where: { id: foodId, localeId: code },
    });
    if (!foodLocal)
      throw new NotFoundError();

    const categories = await cachedParentCategoriesService.getFoodAllCategories(foodLocal.foodCode);

    res.json({ categories });
  };

  return {
    browse,
    store,
    read,
    readByCode,
    update,
    destroy,
    copy,
    categories,
  };
}

export default adminFoodController;

export type AdminFoodController = ReturnType<typeof adminFoodController>;
