import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { CategoryContents } from '@intake24/common/types/http';
import type { PaginateQuery } from '@intake24/db/models';
import { ApplicationError } from '@intake24/api/http/errors';

const categoriesController = ({
  categoryContentsService,
}: Pick<IoC, 'categoryContentsService'>) => {
  const browse = async (
    req: Request<{ localeId: string; code: string }, any, any, PaginateQuery>,
    res: Response
  ): Promise<void> => {
    const { localeId, code } = req.params;

    const foods = await categoryContentsService.searchCategory(
      localeId,
      code,
      pick(req.query, ['page', 'limit', 'sort', 'search'])
    );

    res.json(foods);
  };

  const contents = async (req: Request, res: Response<CategoryContents>): Promise<void> => {
    const { localeId, code } = req.params;

    const categoryContents = await categoryContentsService.getCategoryContents(localeId, code);

    res.json(categoryContents);
  };

  const rootContents = async (req: Request, res: Response<CategoryContents>): Promise<void> => {
    const { localeId, code } = req.params;

    if (typeof req.query.code !== 'string' || !code.length)
      throw new ApplicationError('code cannot be empty');

    const categoryContents = await categoryContentsService.getCategoryContents(localeId, code);
    res.json(categoryContents);
  };

  return {
    browse,
    contents,
    rootContents,
  };
};

export default categoriesController;

export type CategoriesController = ReturnType<typeof categoriesController>;
