import { Request, Response } from 'express';
import { pick } from 'lodash';
import type { IoC } from '@api/ioc';
import { CategoryLocal } from '@api/db/models/foods';
import { NotFoundError } from '@api/http/errors';
import { PaginateQuery } from '@api/db/models/model';
import {
  CategoryContentsResponse,
  CategoryResponse,
  RootCategoriesResponse,
} from '@common/types/http/admin';
import { categoryContentsResponse } from '@api/http/responses/admin/categories';
import type { Controller } from '../../controller';

export type AdminCategoryController = Controller<
  'browse' | 'store' | 'read' | 'update' | 'destroy' | 'root' | 'contents'
>;

export default ({
  adminCategoryService,
}: Pick<IoC, 'adminCategoryService'>): AdminCategoryController => {
  const browse = async (
    req: Request<{ localeId: string }, any, any, PaginateQuery>,
    res: Response
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
    res: Response<CategoryResponse>
  ): Promise<void> => {
    const { categoryId, localeId } = req.params;

    const categoryLocal = await adminCategoryService.getCategory(categoryId, localeId);
    if (!categoryLocal) throw new NotFoundError();

    res.json({ data: categoryLocal, refs: {} });
  };

  const update = async (
    req: Request<{ categoryId: string; localeId: string }>,
    res: Response
  ): Promise<void> => {
    const { categoryId, localeId } = req.params;

    const categoryLocal = await CategoryLocal.findOne({ where: { id: categoryId, localeId } });
    if (!categoryLocal) throw new NotFoundError();

    res.json();
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
