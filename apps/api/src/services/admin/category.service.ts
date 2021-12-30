import { FindOptions, Op, QueryTypes } from 'sequelize';
import {
  Category,
  CategoryAttribute,
  CategoryLocal,
  CategoryPortionSizeMethod,
  CategoryPortionSizeMethodParameter,
  Food,
  FoodLocal,
} from '@api/db/models/foods';
import { CategoryInput, CategoryListEntry } from '@common/types/http/admin';
import type { IoC } from '@api/ioc';
import { PaginateQuery } from '@api/db/models/model';
import { NotFoundError } from '@api/http/errors';
import { pick } from 'lodash';
import { categoryResponse } from '@api/http/responses/admin';
import { CategoryLocalAttributes } from '@common/types/models';

const adminCategoryService = ({ db }: Pick<IoC, 'db'>) => {
  const browseCategories = async (localeId: string, query: PaginateQuery) => {
    const options: FindOptions<CategoryLocalAttributes> = {
      where: { localeId },
      include: [{ model: Category, required: true }],
    };
    const { search } = query;

    if (search) {
      const op =
        CategoryLocal.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['name', '$main.name$'].map((column) => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return CategoryLocal.paginate<CategoryListEntry>({
      query,
      transform: categoryResponse,
      ...options,
    });
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
          association: 'locals',
          attributes: ['name'],
          where: { localeId },
          required: false,
        },
      ],
      order: [['locals', 'name', 'ASC']],
      where: Sequelize.literal(`NOT EXISTS (SELECT cc2.category_code
          FROM categories_categories cc2 JOIN categories c2 ON cc2.category_code = c2.code
          WHERE c2.is_hidden = False AND cc2.subcategory_code = Category.code)`),
    }); */
  };

  const getCategoryContents = async (categoryCode: string, localeId?: string) => {
    const [categories, foods] = await Promise.all([
      CategoryLocal.findAll({
        where: localeId ? { localeId } : {},
        include: [
          {
            model: Category,
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
      }),
      FoodLocal.findAll({
        where: { localeId },
        include: [
          {
            model: Food,
            attributes: ['name'],
            required: true,
            include: [
              { association: 'parentCategoryMappings', attributes: [], where: { categoryCode } },
            ],
          },
        ],
        order: [['name', 'ASC']],
      }),
    ]);

    return { categories, foods };
  };

  const getNoCategoryContents = async (localeId: string) =>
    FoodLocal.findAll({
      where: {
        localeId,
        // @ts-expect-error: Sequelize typings don't know about this type of syntax yet
        '$main->parentCategoryMappings.category_code$': null,
      },
      include: [
        {
          model: Food,
          attributes: ['name'],
          required: true,
          include: [
            {
              association: 'parentCategoryMappings',
              attributes: [],
              required: false,
            },
          ],
        },
      ],
      order: [['name', 'ASC']],
    });

  const getCategory = async (categoryId: string, localeId?: string) => {
    const where = localeId ? { localeId } : {};

    return CategoryLocal.findOne({
      where: { ...where, id: categoryId },
      include: [
        {
          model: Category,
          required: true,
          include: [
            { model: CategoryAttribute },
            {
              association: 'parentCategories',
              through: { attributes: [] },
              include: [{ association: 'locals', attributes: ['name'], where }],
            },
          ],
        },
        {
          model: CategoryPortionSizeMethod,
          separate: true,
          include: [{ model: CategoryPortionSizeMethodParameter, separate: true }],
        },
      ],
    });
  };

  const updateCategory = async (categoryId: string, localeId: string, input: CategoryInput) => {
    const categoryLocal = await getCategory(categoryId, localeId);
    if (!categoryLocal) throw new NotFoundError();

    const { main } = categoryLocal;
    if (!main) throw new NotFoundError();

    const { attributes } = main;
    if (!attributes) throw new NotFoundError();

    const categories = (input.main.parentCategories ?? []).map((cat) => cat.code);

    await Promise.all([
      categoryLocal.update(pick(input, ['name'])),
      main.update(pick(input.main, ['name', 'isHidden'])),
      attributes.update(
        pick(input.main.attributes, [
          'sameAsBeforeOption',
          'readyMealOption',
          'reasonableAmount',
          'useInRecipes',
        ])
      ),
      main.$set('parentCategories', categories),
    ]);

    if (main.code !== input.main.code)
      await Category.update({ code: input.main.code }, { where: { code: main.code } });

    return getCategory(categoryId, localeId);
  };

  return {
    browseCategories,
    getRootCategories,
    getNoCategoryContents,
    getCategoryContents,
    getCategory,
    updateCategory,
  };
};

export default adminCategoryService;

export type AdminCategoryService = ReturnType<typeof adminCategoryService>;
