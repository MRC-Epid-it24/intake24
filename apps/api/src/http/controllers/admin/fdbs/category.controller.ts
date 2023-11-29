import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  CategoriesResponse,
  CategoryContentsResponse,
  CategoryInput,
  CategoryLocalEntry,
  MainCategoriesResponse,
  RootCategoriesResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { categoryContentsResponse } from '@intake24/api/http/responses/admin/categories';
import { CategoryLocal, SystemLocale } from '@intake24/db';

import { getAndCheckAccess } from '../securable.controller';

const adminCategoryController = ({ adminCategoryService }: Pick<IoC, 'adminCategoryService'>) => {
  const browse = async (
    req: Request<{ localeId: string }, any, any, PaginateQuery>,
    res: Response<CategoriesResponse>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(
      SystemLocale,
      'food-list',
      req as Request<{ localeId: string }>
    );

    const categories = await adminCategoryService.browseCategories(
      code,
      pick(req.query, ['page', 'limit', 'sort', 'search'])
    );

    res.json(categories);
  };

  const browseMain = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<MainCategoriesResponse>
  ): Promise<void> => {
    const categories = await adminCategoryService.browseMainCategories(
      pick(req.query, ['page', 'limit', 'sort', 'search'])
    );

    res.json(categories);
  };

  const store = async (
    req: Request<{ localeId: string }, any, CategoryInput>,
    res: Response<CategoryLocalEntry>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);

    const categoryLocal = await adminCategoryService.createCategory(code, req.body);

    res.json(categoryLocal);
  };

  const read = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response<CategoryLocalEntry>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);
    const { categoryId } = req.params;

    const categoryLocal = await adminCategoryService.getCategory(categoryId, code);
    if (!categoryLocal) throw new NotFoundError();

    res.json(categoryLocal);
  };

  const update = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response<CategoryLocalEntry>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);
    const { categoryId } = req.params;

    const { aclService } = req.scope.cradle;
    const { main, ...rest } = req.body;

    const canUpdateMain = !!(
      main?.code &&
      ((await aclService.hasPermission('locales|food-list')) ||
        (await CategoryLocal.count({ where: { categoryCode: main.code } })) === 1)
    );

    const categoryLocal = await adminCategoryService.updateCategory(
      categoryId,
      code,
      canUpdateMain ? req.body : rest
    );
    if (!categoryLocal) throw new NotFoundError();

    res.json(categoryLocal);
  };

  const destroy = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);
    const { categoryId } = req.params;

    const categoryLocal = await CategoryLocal.findOne({
      where: { id: categoryId, localeId: code },
    });
    if (!categoryLocal) throw new NotFoundError();

    await categoryLocal.destroy();

    res.json();
  };

  const root = async (
    req: Request<{ localeId: string }>,
    res: Response<RootCategoriesResponse>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);

    const categories = await adminCategoryService.getRootCategories(code);

    res.json(categories);
  };

  const contents = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response<CategoryContentsResponse>
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);
    const { categoryId } = req.params;

    if (categoryId === 'no-category') {
      const foods = await adminCategoryService.getNoCategoryContents(code);
      res.json(categoryContentsResponse({ categories: [], foods }));
      return;
    }

    const categoryLocal = await CategoryLocal.findOne({
      where: { id: categoryId, localeId: code },
    });
    if (!categoryLocal) throw new NotFoundError();

    const data = await adminCategoryService.getCategoryContents(categoryLocal.categoryCode, code);

    res.json(categoryContentsResponse(data));
  };

  const copy = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response
  ): Promise<void> => {
    const { code } = await getAndCheckAccess(SystemLocale, 'food-list', req);
    const { categoryId } = req.params;

    const categoryLocal = await adminCategoryService.copyCategory(categoryId, code, req.body);

    res.json(categoryLocal);
  };

  return {
    browse,
    browseMain,
    store,
    read,
    update,
    destroy,
    root,
    contents,
    copy,
  };
};

export default adminCategoryController;

export type AdminCategoryController = ReturnType<typeof adminCategoryController>;
