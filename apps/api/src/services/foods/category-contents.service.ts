import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type {
  CategoryContents,
  CategoryHeader,
  CategorySearch,
  FoodHeader,
} from '@intake24/common/types/http';
import type { FindOptions, FoodAttributes, PaginateQuery } from '@intake24/db';
import {
  Category,
  Food,
  getAllChildCategories,
  Op,
  QueryTypes,
} from '@intake24/db';

function categoryContentsService({
  adminCategoryService,
  db,
}: Pick<IoC, 'db' | 'adminCategoryService'>) {
  const filterUndefined = (
    headers: { id: string; code: string; name: string | undefined }[],
  ): (CategoryHeader | FoodHeader)[] =>
    headers.filter(h => h.name).map(h => ({ id: h.id, code: h.code, name: h.name! }));

  const getRootCategories = async (localeCode: string): Promise<CategoryContents> => {
    const categories = await adminCategoryService.getRootCategories(localeCode);

    return {
      header: { id: '', code: '', name: 'Root' },
      foods: [],
      subcategories: categories
        .filter(({ hidden }) => !hidden)
        .map(({ id, code, name }) => ({ id, code, name })),
    };
  };

  const getCategoryHeader = async (localeCode: string, code: string): Promise<CategoryHeader> => {
    const category = await Category.findOne({
      where: { code, localeId: localeCode },
      attributes: ['id', 'code'],
    });

    if (!category)
      throw new NotFoundError(`Category ${code} not found`);

    return { id: category.name, code, name: category.name };
  };

  const getCategoryContents = async (localeCode: string, code: string): Promise<CategoryContents> => {
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

    const header = await getCategoryHeader(localeCode, code);

    const category = await Category.findOne({
      where: { code, localeId: localeCode },
      attributes: ['code'],
      include: [
        {
          association: 'subCategories',
          required: true,
          attributes: ['id', 'code', 'name'],
        },
      ],
    });

    const foods = await Food.findAll({
      attributes: ['id', 'code', 'name'],
      where: { localeId: localeCode },
      include: [
        {
          association: 'parentCategories',
          where: { categoryId: code },
        },
      ],
    });

    const foodHeaders = foods.map(({ id, code, name }) => ({ id, code, name }));
    const categoryHeaders = (category?.subCategories ?? []).map(({ id, code, name }) => ({ id, code, name }));

    return {
      header,
      foods: filterUndefined(foodHeaders).sort((a, b) => a.name.localeCompare(b.name)),
      subcategories: filterUndefined(categoryHeaders).sort((a, b) => a.name.localeCompare(b.name)),
    };
  };

  const searchCategory = async (localeCode: string, code: string, query: PaginateQuery): Promise<CategorySearch> => {
    const categories = await db.foods.query<{ id: string }>(getAllChildCategories, {
      type: QueryTypes.SELECT,
      replacements: { code },
      plain: false,
      raw: true,
    });

    const options: FindOptions<FoodAttributes> = {
      attributes: ['id', 'code', 'name'],
      where: { code, localeId: localeCode },
      include: [
        {
          attributes: ['categoryId'],
          association: 'parentCategoryMappings',
          where: { categoryId: categories.map(({ id }) => id) },
        },
      ],
      order: [['name', 'ASC']],
    };
    const { search } = query;

    if (search) {
      const op
        = Food.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['englishName', 'name'].map(column => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return Food.paginate({
      query,
      ...options,
      transform: food => ({ id: food.id, code: food.code, name: food.name }),
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
