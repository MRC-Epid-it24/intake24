import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { CategoryInput, CategoryListEntry } from '@intake24/common/types/http/admin';
import type { CategoryLocalAttributes } from '@intake24/common/types/models';
import type { FindOptions, PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { categoryResponse } from '@intake24/api/http/responses/admin';
import { Category, CategoryLocal, FoodLocal, Op, QueryTypes } from '@intake24/db';

const adminCategoryService = ({ db }: Pick<IoC, 'db'>) => {
  const browseCategories = async (localeId: string, query: PaginateQuery) => {
    const options: FindOptions<CategoryLocalAttributes> = {
      where: { localeId },
      include: [{ association: 'main', required: true }],
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

    return CategoryLocal.paginate({
      query,
      transform: categoryResponse,
      ...options,
    });
  };

  const getRootCategories = async (localeId: string) => {
    // TODO: verify for other dialects
    const query = `SELECT DISTINCT
      c.code, c.name as "englishName", c.is_hidden as "isHidden", cl.id, cl.locale_id as "localeId", cl.name  
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
            association: 'main',
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
            association: 'main',
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
        '$main->parentCategoryMappings.category_code$': null,
      },
      include: [
        {
          association: 'main',
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
          association: 'main',
          required: true,
          include: [
            { association: 'attributes' },
            {
              association: 'parentCategories',
              through: { attributes: [] },
              include: [{ association: 'locals', attributes: ['name'], where }],
            },
          ],
        },
        {
          association: 'portionSizeMethods',
          separate: true,
          include: [{ association: 'parameters', separate: true }],
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

    await db.foods.transaction(async (transaction) => {
      await Promise.all([
        categoryLocal.update(pick(input, ['name']), { transaction }),
        main.update(pick(input.main, ['name', 'isHidden']), { transaction }),
        attributes.update(
          pick(input.main.attributes, [
            'sameAsBeforeOption',
            'readyMealOption',
            'reasonableAmount',
            'useInRecipes',
          ]),
          { transaction }
        ),
        main.$set('parentCategories', categories, { transaction }),
      ]);

      if (main.code !== input.main.code)
        await Category.update(
          { code: input.main.code },
          { where: { code: main.code }, transaction }
        );
    });

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
