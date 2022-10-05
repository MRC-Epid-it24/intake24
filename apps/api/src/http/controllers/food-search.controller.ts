import type { Request, Response } from 'express';

import type { SearchSortingAlgorithm } from '@intake24/common/types/models';
import foodIndex, { IndexNotReadyError } from '@intake24/api/food-index';
import { NotFoundError } from '@intake24/api/http/errors';

interface SearchParams {
  localeId: string;
}

interface SearchQuery {
  description: string;
  previous: string[];
  limit?: string;
  rankingAlgorithm?: SearchSortingAlgorithm;
  matchScoreWeight?: string;
}

const foodSearchController = () => {
  const search = async (
    req: Request<SearchParams, unknown, unknown, SearchQuery>,
    res: Response
  ): Promise<void> => {
    try {
      const results = await foodIndex.search(
        req.query.description,
        req.params.localeId,
        req.query.rankingAlgorithm ?? 'popularity',
        parseFloat(req.query.matchScoreWeight ?? '20')
      );
      res.json(results);
    } catch (err) {
      if (err instanceof IndexNotReadyError) {
        res.sendStatus(503);
        return;
      }
      if (err instanceof NotFoundError) {
        res.sendStatus(404);
        return;
      }
      throw err;
    }
  };

  const recipe = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    res.json();
  };

  const category = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    const { code } = req.query;

    res.json();
  };

  const splitDescription = async (req: Request, res: Response): Promise<void> => {
    const { localeId } = req.params;
    res.json();
  };

  return {
    search,
    recipe,
    category,
    splitDescription,
  };
};

export default foodSearchController;

export type FoodSearchController = ReturnType<typeof foodSearchController>;
