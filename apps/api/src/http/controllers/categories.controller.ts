import type { Request, Response } from 'express';
import type { IoC } from '@intake24/api/ioc';
import type { Controller } from './controller';

export type CategoriesController = Controller<'browse' | 'browseRoot'>;

export default ({
  categoryContentsService,
}: Pick<IoC, 'categoryContentsService'>): CategoriesController => {
  const browseRoot = async (req: Request, res: Response): Promise<void> => {
    const { localeId, code } = req.params;

    if (typeof req.query.code !== 'string' || code.length === 0) {
      res.status(400).send('code cannot be empty');
      return Promise.resolve();
    }

    return categoryContentsService.getCategoryContents(localeId, code).then(
      (categoryContents) => {
        res.json(categoryContents);
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  };

  const browse = async (req: Request, res: Response): Promise<void> => {
    const { localeId, code } = req.params;

    return categoryContentsService.getCategoryContents(localeId, code).then(
      (categoryContents) => {
        res.json(categoryContents);
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  };

  return {
    browse,
    browseRoot,
  };
};
