import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { col, fn } from 'sequelize';

import type {
  FoodDatabaseEntry,
  FoodDatabaseRefs,
  LocalesResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateOptions, PaginateQuery } from '@intake24/db';
import { localeResponse } from '@intake24/api/http/responses/admin';
import { NutrientTable, Op, securableScope, SystemLocale } from '@intake24/db';

const adminFoodDatabaseController = () => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LocalesResponse>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const paginateOptions: PaginateOptions = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['code', 'englishName', 'localName'],
      order: [[fn('lower', col('code')), 'ASC']],
    };

    if (await aclService.hasPermission('locales|food-list')) {
      const locales = await SystemLocale.paginate(paginateOptions);
      res.json(locales);
      return;
    }

    const locales = await SystemLocale.paginate({
      ...paginateOptions,
      where: { [Op.or]: { ownerId: userId, '$securables.action$': ['food-list'] } },
      ...securableScope(userId),
      subQuery: false,
    });

    res.json(locales);
  };

  const read = async (
    req: Request<{ localeId: string }>,
    res: Response<FoodDatabaseEntry>
  ): Promise<void> => {
    const { localeId } = req.params;
    const { aclService } = req.scope.cradle;

    const locale = await aclService.findAndCheckRecordAccess(SystemLocale, 'food-list', {
      where: { id: localeId },
    });

    res.json(localeResponse(locale));
  };

  const refs = async (req: Request, res: Response<FoodDatabaseRefs>): Promise<void> => {
    const nutrientTables = await NutrientTable.scope('list').findAll();

    res.json({ nutrientTables });
  };

  return { browse, read, refs };
};

export default adminFoodDatabaseController;

export type AdminFoodDatabaseController = ReturnType<typeof adminFoodDatabaseController>;
