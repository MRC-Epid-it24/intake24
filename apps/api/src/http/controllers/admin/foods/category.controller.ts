import type { Request, Response } from 'express';
import { pick } from 'lodash';
import type { IoC } from '@intake24/api/ioc';
import type { PaginateQuery } from '@intake24/db';
import { CategoryLocal } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import type {
  CategoryLocalEntry,
  CategoryContentsResponse,
  RootCategoriesResponse,
  CategoriesResponse,
} from '@intake24/common/types/http/admin';
import { categoryContentsResponse } from '@intake24/api/http/responses/admin/categories';
import type { Controller, CrudActions } from '../../controller';

export type AdminCategoryController = Controller<
  Exclude<CrudActions, 'edit' | 'refs'> | 'root' | 'contents'
>;

export default ({
  adminCategoryService,
}: Pick<IoC, 'adminCategoryService'>): AdminCategoryController => {
  const browse = async (
    req: Request<{ localeId: string }, any, any, PaginateQuery>,
    res: Response<CategoriesResponse>
  ): Promise<void> => {
    const { localeId } = req.params;

    const categories = await adminCategoryService.browseCategories(
      localeId,
      pick(req.query, ['page', 'limit', 'sort', 'search'])
    );

    res.json(categories);
  };

  const store = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response
  ): Promise<void> => {
    res.json();
  };

  const read = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response<CategoryLocalEntry>
  ): Promise<void> => {
    const { categoryId, localeId } = req.params;

    const categoryLocal = await adminCategoryService.getCategory(categoryId, localeId);
    if (!categoryLocal) throw new NotFoundError();

    res.json(categoryLocal);
  };

  const update = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response<CategoryLocalEntry>
  ): Promise<void> => {
    const { categoryId, localeId } = req.params;

    const categoryLocal = await adminCategoryService.updateCategory(categoryId, localeId, req.body);
    if (!categoryLocal) throw new NotFoundError();

    res.json(categoryLocal);
  };

  const destroy = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { categoryId, localeId } = req.params;

    const categoryLocal = await CategoryLocal.findOne({ where: { id: categoryId, localeId } });
    if (!categoryLocal) throw new NotFoundError();

    await categoryLocal.destroy();

    res.json();
  };

  const root = async (
    req: Request<{ localeId: string }>,
    res: Response<RootCategoriesResponse>
  ): Promise<void> => {
    const { localeId } = req.params;

    const categories = await adminCategoryService.getRootCategories(localeId);

    res.json(categories);
  };

  const contents = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response<CategoryContentsResponse>
  ): Promise<void> => {
    const { categoryId, localeId } = req.params;

    if (categoryId === 'no-category') {
      const foods = await adminCategoryService.getNoCategoryContents(localeId);
      res.json(categoryContentsResponse({ categories: [], foods }));
      return;
    }

    const categoryLocal = await CategoryLocal.findOne({ where: { id: categoryId, localeId } });
    if (!categoryLocal) throw new NotFoundError();

    const data = await adminCategoryService.getCategoryContents(
      categoryLocal.categoryCode,
      localeId
    );

    res.json(categoryContentsResponse(data));
  };

  return {
    browse,
    store,
    read,
    update,
    destroy,
    root,
    contents,
  };
};
