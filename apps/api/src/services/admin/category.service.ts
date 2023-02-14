import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { CategoryInput, CategoryListEntry } from '@intake24/common/types/http/admin';
import type {
  CategoryAttributes,
  CategoryLocalAttributes,
  CategoryPortionSizeMethodUpdateAttributes,
  PortionSizeMethodParameterUpdateAttributes,
} from '@intake24/common/types/models';
import type { FindOptions, PaginateQuery, Transaction } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { categoryResponse } from '@intake24/api/http/responses/admin';
import {
  Category,
  CategoryLocal,
  CategoryPortionSizeMethod,
  CategoryPortionSizeMethodParameter,
  FoodLocal,
  Op,
  QueryTypes,
} from '@intake24/db';

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

      const ops = ['code', 'name', '$main.name$'].map((column) => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return CategoryLocal.paginate({
      query,
      transform: categoryResponse,
      ...options,
    });
  };

  const browseMainCategories = async (query: PaginateQuery) => {
    const options: FindOptions<CategoryAttributes> = {};
    const { search } = query;

    if (search) {
      const op =
        Category.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['code', 'name'].map((column) => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return Category.paginate({ query, ...options });
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

  const getCategory = async (categoryId: string, localeCode?: string) => {
    const where = localeCode ? { localeId: localeCode } : {};

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
          include: [
            {
              association: 'parameters',
              include: [
                {
                  association: 'asServedSet',
                  where: {
                    $method$: 'as-served',
                    '$parameters.name$': ['serving-image-set', 'leftovers-image-set'],
                  },
                  required: false,
                  include: [{ association: 'selectionImage', attributes: ['path'] }],
                },
                {
                  association: 'guideImage',
                  where: { $method$: 'guide-image', '$parameters.name$': ['guide-image-id'] },
                  required: false,
                  include: [{ association: 'selectionImage', attributes: ['path'] }],
                },
                /* {
                  association: 'standardUnit',
                  attributes: ['id', 'estimateIn', 'howMany'],
                  where: { '$parameters.name$': { [Op.endsWith]: '-name' } },
                  required: false,
                }, */
              ],
            },
          ],
          order: [['orderBy', 'ASC']],
        },
      ],
    });
  };

  const updateParameters = async (
    portionSizeMethodId: string,
    parameters: CategoryPortionSizeMethodParameter[],
    inputs: PortionSizeMethodParameterUpdateAttributes[],
    { transaction }: { transaction: Transaction }
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await CategoryPortionSizeMethodParameter.destroy({
      where: { portionSizeMethodId, id: { [Op.notIn]: ids } },
      transaction,
    });

    if (!inputs.length) return [];

    const newParameters: CategoryPortionSizeMethodParameter[] = [];

    for (const input of inputs) {
      const { id, ...rest } = input;

      if (id) {
        const match = parameters.find((parameter) => parameter.id === id);
        if (match) {
          await match.update(rest, { transaction });
          continue;
        }
      }

      const newParameter = await CategoryPortionSizeMethodParameter.create(
        { ...rest, portionSizeMethodId },
        { transaction }
      );
      newParameters.push(newParameter);
    }

    return [...parameters, ...newParameters];
  };

  const updatePortionSizeMethods = async (
    categoryLocalId: string,
    methods: CategoryPortionSizeMethod[],
    inputs: CategoryPortionSizeMethodUpdateAttributes[],
    { transaction }: { transaction: Transaction }
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await CategoryPortionSizeMethod.destroy({
      where: { categoryLocalId, id: { [Op.notIn]: ids } },
      transaction,
    });

    if (!inputs.length) return [];

    const newMethods: CategoryPortionSizeMethod[] = [];

    for (const input of inputs) {
      const { id, parameters, ...rest } = input;

      if (id) {
        const match = methods.find((method) => method.id === id);
        if (match) {
          if (!match.parameters) await match.reload({ include: [{ association: 'parameters' }] });
          if (!match.parameters) throw new NotFoundError();

          await match.update(rest, { transaction });
          await updateParameters(match.id, match.parameters, parameters, { transaction });
          continue;
        }
      }

      const newMethod = await CategoryPortionSizeMethod.create(
        { ...rest, categoryLocalId },
        { transaction }
      );
      newMethods.push(newMethod);

      if (parameters.length) {
        const records = parameters.map((item) => ({
          ...item,
          portionSizeMethodId: newMethod.id,
        }));
        await CategoryPortionSizeMethodParameter.bulkCreate(records, { transaction });
      }
    }

    return [...methods, ...newMethods];
  };

  const updateCategory = async (
    categoryLocalId: string,
    localeId: string,
    input: CategoryInput
  ) => {
    const categoryLocal = await getCategory(categoryLocalId, localeId);
    if (!categoryLocal) throw new NotFoundError();

    const { main, portionSizeMethods } = categoryLocal;
    if (
      !main ||
      !portionSizeMethods ||
      portionSizeMethods.some((psm) => psm.parameters === undefined)
    )
      throw new NotFoundError();

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
        updatePortionSizeMethods(categoryLocalId, portionSizeMethods, input.portionSizeMethods, {
          transaction,
        }),
      ]);

      if (main.code !== input.main.code)
        await Category.update(
          { code: input.main.code },
          { where: { code: main.code }, transaction }
        );
    });

    return getCategory(categoryLocalId, localeId);
  };

  return {
    browseCategories,
    browseMainCategories,
    getRootCategories,
    getNoCategoryContents,
    getCategoryContents,
    getCategory,
    updateCategory,
  };
};

export default adminCategoryService;

export type AdminCategoryService = ReturnType<typeof adminCategoryService>;
