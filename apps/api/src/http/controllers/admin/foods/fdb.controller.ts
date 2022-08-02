import type { Request, Response } from 'express';
import { pick } from 'lodash';
import type { PaginateQuery, WhereOptions } from '@intake24/db';
import { NutrientTable, FoodsLocale, SystemLocale } from '@intake24/db';
import type {
  FoodDatabaseEntry,
  FoodDatabaseRefs,
  LocalesResponse,
} from '@intake24/common/types/http/admin';
import type { LocaleAttributes } from '@intake24/common/types/models';
import { foodDatabaseMaintainerPrefix, foodsAdmin } from '@intake24/common/security';
import { NotFoundError } from '@intake24/api/http/errors';

const adminFoodDatabaseController = () => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<LocalesResponse>
  ): Promise<void> => {
    const permissions = (await req.scope.cradle.aclService.getPermissions()).map(
      ({ name }) => name
    );

    const where: WhereOptions<LocaleAttributes> = {};
    if (!permissions.includes(foodsAdmin)) {
      const fdbs = permissions
        .filter((permission) => permission.startsWith(foodDatabaseMaintainerPrefix))
        .map((permission) => permission.replace(foodDatabaseMaintainerPrefix, ''));

      where.id = fdbs;
    }

    const locales = await SystemLocale.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'englishName', 'localName'],
      order: [['id', 'ASC']],
    });

    res.json(locales);
  };

  const read = async (
    req: Request<{ localeId: string }>,
    res: Response<FoodDatabaseEntry>
  ): Promise<void> => {
    const { localeId } = req.params;

    const [systemLocale, foodsLocale] = await Promise.all([
      SystemLocale.findByPk(localeId),
      FoodsLocale.findByPk(localeId),
    ]);
    if (!systemLocale || !foodsLocale) throw new NotFoundError();

    res.json(systemLocale);
  };

  const refs = async (req: Request, res: Response<FoodDatabaseRefs>): Promise<void> => {
    const nutrientTables = await NutrientTable.scope('list').findAll();

    res.json({ nutrientTables });
  };

  return { browse, read, refs };
};

export default adminFoodDatabaseController;

export type AdminFoodDatabaseController = ReturnType<typeof adminFoodDatabaseController>;
