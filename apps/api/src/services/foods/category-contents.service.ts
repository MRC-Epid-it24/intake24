import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type {
  CategoryContents,
  CategoryHeader,
  CategorySearch,
  FoodHeader,
} from '@intake24/common/types/http';
import type { FindOptions, FoodLocalAttributes, PaginateQuery } from '@intake24/db';
import {
  Category,
  FoodCategory,
  FoodLocal,
  getAllChildCategories,
  FoodsLocale as Locale,
  Op,
  QueryTypes,
} from '@intake24/db';

function categoryContentsService({
  adminCategoryService,
  db,
}: Pick<IoC, 'db' | 'adminCategoryService'>) {
  const filterUndefined = (
    headers: { code: string; name: string | undefined }[],
  ): (CategoryHeader | FoodHeader)[] =>
    headers.filter(h => h.name !== undefined).map(h => ({ code: h.code, name: h.name! }));

  const getLocaleInfo = async (localeId: string): Promise<Locale> => {
    const locale = await Locale.findOne({
      where: { id: localeId },
      attributes: ['prototypeLocaleId'],
    });

    if (!locale)
      throw new NotFoundError(`Locale ${localeId} not found`);

    return locale;
  };

  const getRootCategories = async (localeId: string): Promise<CategoryContents> => {
    const categories = await adminCategoryService.getRootCategories(localeId);

    return {
      header: { code: '', name: 'Root' },
      foods: [],
      subcategories: categories
        .filter(({ isHidden }) => !isHidden)
        .map(({ code, name }) => ({ code, name })),
    };
  };

  const getCategoryHeader = async (
    localeId: string,
    prototypeLocaleId: string | null,
    categoryCode: string,
  ): Promise<CategoryHeader> => {
    const category = await Category.findOne({
      where: { code: categoryCode },
      attributes: ['code'],
      include: [
        {
          association: 'locals',
          where: { localeId },
          required: false,
        },
        {
          association: 'prototypeLocals',
          where: { localeId: prototypeLocaleId },
          required: false,
        },
      ],
    });

    if (category === null)
      throw new NotFoundError(`Category ${categoryCode} not found`);

    return {
      code: categoryCode,
      name: category.locals?.at(0)?.name ?? category.prototypeLocals?.at(0)?.name ?? '# Name missing!',
    };
  };

  const getCategoryContents = async (
    localeId: string,
    categoryCode: string,
  ): Promise<CategoryContents> => {
    /*
        v3 implementation

        SELECT code, description, coalesce(fl.local_description, flp.local_description) as local_description
          FROM foods_categories
             INNER JOIN foods_local_lists ON foods_categories.food_code = foods_local_lists.food_code AND foods_local_lists.locale_id = {locale_id}
             LEFT JOIN foods ON foods.code = foods_local_lists.food_code
             LEFT JOIN foods_local as fl ON fl.food_code = foods_local_lists.food_code AND fl.locale_id = {locale_id}
             LEFT JOIN foods_local as flp ON flp.food_code = foods_local_lists.food_code AND flp.locale_id IN
                                                                                             (SELECT prototype_locale_id AS l FROM locales WHERE id = {locale_id})
       WHERE foods_categories.category_code = {category_code} AND coalesce(fl.local_description, flp.local_description) IS NOT NULL
       ORDER BY coalesce(fl.local_description, flp.local_description)
       LIMIT 30 */

    const locale = await getLocaleInfo(localeId);

    const { prototypeLocaleId } = locale;

    const header = await getCategoryHeader(localeId, prototypeLocaleId, categoryCode);

    const category = await Category.findOne({
      where: { code: categoryCode },
      attributes: ['code'],
      include: [
        {
          association: 'subCategories',
          required: true,
          attributes: ['code'],
          include: [
            { association: 'locals', where: { localeId }, required: false },
            {
              association: 'prototypeLocals',
              where: { localeId: prototypeLocaleId },
              required: false,
            },
          ],
        },
      ],
    });

    const foods = await FoodCategory.findAll({
      where: { categoryCode },
      include: [
        {
          association: 'food',
          required: true,
          include: [
            {
              association: 'locales',
              attributes: [],
              where: { id: localeId },
              required: true,
            },
            {
              association: 'locals',
              where: { localeId },
              required: false,
            },
            {
              association: 'prototypeLocals',
              where: { localeId: prototypeLocaleId },
              required: false,
            },
          ],
        },
      ],
    });

    const foodHeaders = foods.map((row) => {
      const name = row.food?.locals?.at(0)?.name ?? row.food?.prototypeLocals?.at(0)?.name;

      return { code: row.foodCode, name };
    });

    const categoryHeaders = (category?.subCategories ?? []).map((row) => {
      const name = row.locals?.at(0)?.name ?? row.prototypeLocals?.at(0)?.name;

      return { code: row.code, name };
    });

    return {
      header,
      foods: filterUndefined(foodHeaders).sort((a, b) => a.name.localeCompare(b.name)),
      subcategories: filterUndefined(categoryHeaders).sort((a, b) => a.name.localeCompare(b.name)),
    };
  };

  const searchCategory = async (
    localeId: string,
    category: string,
    query: PaginateQuery,
  ): Promise<CategorySearch> => {
    const categories = await db.foods.query<{ code: string }>(getAllChildCategories, {
      type: QueryTypes.SELECT,
      replacements: { category },
      plain: false,
      raw: true,
    });

    const options: FindOptions<FoodLocalAttributes> = {
      attributes: ['foodCode', 'name'],
      where: { localeId },
      include: [
        {
          association: 'main',
          attributes: ['code'],
          required: true,
          include: [
            {
              attributes: ['categoryCode'],
              association: 'parentCategoryMappings',
              where: { categoryCode: categories.map(({ code }) => code) },
            },
          ],
        },
      ],
      order: [['name', 'ASC']],
    };
    const { search } = query;

    if (search) {
      const op
        = FoodLocal.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['name'].map(column => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return FoodLocal.paginate({
      query,
      ...options,
      transform: food => ({ code: food.foodCode, name: food.name }),
    });
  };

  return {
    getCategoryContents,
    getCategoryHeader,
    getRootCategories,
    searchCategory,
  };
}

export default categoryContentsService;

export type CategoryContentsService = ReturnType<typeof categoryContentsService>;
