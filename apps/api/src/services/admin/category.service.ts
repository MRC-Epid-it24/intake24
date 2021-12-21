import { FindOptions, Op, QueryTypes } from 'sequelize';
import {
  Category,
  CategoryLocal,
  CategoryPortionSizeMethod,
  CategoryPortionSizeMethodParameter,
  FoodLocal,
} from '@api/db/models/foods';
import { CategoryListEntry } from '@common/types/http/admin';
import type { IoC } from '@api/ioc';
import { PaginateQuery } from '@api/db/models/model';

const adminCategoryService = ({ db }: Pick<IoC, 'db'>) => {
  const browseCategories = async (localeId: string, query: PaginateQuery) => {
    const options: FindOptions = { where: { localeId }, include: [{ model: Category }] };
    const { search } = query;

    if (search) {
      const op =
        CategoryLocal.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['name', '$category.name$'].map((column) => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return CategoryLocal.paginate({ query, ...options });
  };

  const getRootCategories = async (localeId: string) => {
    // TODO: verify for other dialects
    const query = `SELECT DISTINCT
      c.code, c.name as englishName, c.is_hidden as isHidden, cl.id, cl.locale_id as localeId, cl.name  
      FROM categories c
      LEFT JOIN categories_categories cc ON c.code = cc.subcategory_code
      LEFT JOIN category_locals cl ON c.code = cl.category_code
      WHERE NOT EXISTS (
        SELECT * from categories_categories cc2 JOIN categories c2 ON cc2.category_code = c2.code
        WHERE c2.is_hidden = :isHidden AND cc2.subcategory_code = c.code
      )
      AND cl.locale_id = :localeId
      ORDER BY cl.name`;

    return db.foods.query<CategoryListEntry>(query, {
      type: QueryTypes.SELECT,
      replacements: { localeId, isHidden: false },
    });

    /* const categories = await Category.findAll({
      attributes: ['code', 'description', 'isHidden'],
      include: [
        { association: 'subcategoryMappings', attributes: [] },
        {
          association: 'localCategories',
          attributes: ['localDescription'],
          where: { localeId },
          required: false,
        },
      ],
      order: [['localCategories', 'localDescription', 'ASC']],
      where: Sequelize.literal(`NOT EXISTS (SELECT cc2.category_code
          FROM categories_categories cc2 JOIN categories c2 ON cc2.category_code = c2.code
          WHERE c2.is_hidden = False AND cc2.subcategory_code = Category.code)`),
    }); */
  };

  const getCategoryContents = async (categoryCode: string, localeId?: string) => {
    const categories = await CategoryLocal.findAll({
      where: localeId ? { localeId } : {},
      include: [
        {
          association: 'category',
          attributes: ['name', 'isHidden'],
          required: true,
          include: [
            {
              association: 'parentCategoryMappings',
              attributes: [],
              where: { categoryCode },
            },
          ],
        },
      ],
      order: [['name', 'ASC']],
    });

    const foods = await FoodLocal.findAll({
      where: { localeId },
      include: [
        {
          association: 'food',
          attributes: ['name'],
          required: true,
          include: [{ association: 'categoryMappings', attributes: [], where: { categoryCode } }],
        },
      ],
      order: [['name', 'ASC']],
    });

    return { categories, foods };
  };

  const getCategory = async (categoryId: string, localeId?: string) =>
    CategoryLocal.findOne({
      where: localeId ? { id: categoryId, localeId } : { id: categoryId },
      include: [
        {
          model: Category,
          include: [
            { association: 'attributes' },
            { association: 'parentCategories', through: { attributes: [] } },
          ],
        },
        {
          model: CategoryPortionSizeMethod,
          separate: true,
          include: [{ model: CategoryPortionSizeMethodParameter, separate: true }],
        },
      ],
    });

  return {
    browseCategories,
    getRootCategories,
    getCategoryContents,
    getCategory,
  };
};

export default adminCategoryService;

export type AdminCategoryService = ReturnType<typeof adminCategoryService>;
