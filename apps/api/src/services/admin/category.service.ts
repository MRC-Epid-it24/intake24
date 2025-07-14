import { randomUUID } from 'node:crypto';

import { pick } from 'lodash';

import { NotFoundError } from '@intake24/api/http/errors';
import { categoryResponse } from '@intake24/api/http/responses/admin';
import type { IoC } from '@intake24/api/ioc';
import { toSimpleName } from '@intake24/api/util';
import type {
  CategoryCopyInput,
  CategoryInput,
  CategoryListEntry,
} from '@intake24/common/types/http/admin';
import type {
  CategoryAttributes,
  FindOptions,
  PaginateQuery,
  Transaction,
} from '@intake24/db';
import {
  Category,
  CategoryPortionSizeMethod,
  Food,
  Op,
  QueryTypes,
} from '@intake24/db';
import { CacheKey } from '../core/redis/cache';

function adminCategoryService({ cache, db }: Pick<IoC, 'cache' | 'db'>) {
  const browseCategories = async (localeCode: string, query: PaginateQuery) => {
    const options: FindOptions<CategoryAttributes> = { where: { localeId: localeCode } };
    const { search } = query;

    if (search) {
      const op
        = Category.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['code', 'englishName', 'name'].map(column => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return Category.paginate({
      query,
      transform: categoryResponse,
      ...options,
    });
  };

  const browseMainCategories = async (query: PaginateQuery) => {
    const options: FindOptions<CategoryAttributes> = {};
    const { search } = query;

    if (search) {
      const op
        = Category.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['code', 'name'].map(column => ({ [column]: op }));

      options.where = { ...options.where, [Op.or]: ops };
    }

    return Category.paginate({ query, ...options });
  };

  const getRootCategories = async (localeCode: string) => {
    // TODO: verify for other dialects
    const query = `SELECT DISTINCT
      c.id, c.locale_id as "localeId", c.code, c.english_name as "englishName", c.name, c.hidden
      FROM categories c
      LEFT JOIN categories_categories cc ON c.id = cc.sub_category_id
      WHERE NOT EXISTS (
        SELECT * from categories_categories cc2 JOIN categories c2 ON cc2.category_id = c2.id
        WHERE c2.hidden = :hidden AND cc2.sub_category_id = c.id
      )
      AND c.locale_id = :localeCode
      ORDER BY c.name`;

    return db.foods.query<CategoryListEntry>(query, {
      type: QueryTypes.SELECT,
      replacements: { localeCode, hidden: false },
    });

    /* const categories = await Category.findAll({
      attributes: ['code', 'description', 'hidden'],
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

  const getCategoryContents = async (localeCode: string, categoryId: string) => {
    const [categories, foods] = await Promise.all([
      Category.findAll({
        where: { localeId: localeCode },
        include: [
          {
            association: 'parentCategoryMappings',
            attributes: [],
            where: { categoryId },
          },
        ],
        order: [['name', 'ASC']],
      }),
      Food.findAll({
        where: { localeId: localeCode },
        include: [
          {
            association: 'parentCategoryMappings',
            attributes: [],
            where: { categoryId },
          },
        ],
        order: [['name', 'ASC']],
      }),
    ]);

    return { categories, foods };
  };

  const getNoCategoryContents = async (localeCode: string) =>
    Food.findAll({
      where: { localeId: localeCode },
      include: [
        {
          association: 'parentCategoryMappings',
          attributes: [],
          required: false,
          where: { categoryId: null },
        },
      ],
      order: [['name', 'ASC']],
    });

  const getCategory = async (localeCode: string, categoryId: string) => {
    return Category.findOne({
      where: { localeId: localeCode, id: categoryId },
      include: [
        {
          association: 'parentCategories',
          through: { attributes: [] },
        },
        {
          association: 'portionSizeMethods',
          separate: true,
          order: [['orderBy', 'ASC']],
        },
      ],
    });
  };

  const updatePortionSizeMethods = async (
    categoryId: string,
    methods: CategoryPortionSizeMethod[],
    inputs: CategoryInput['portionSizeMethods'],
    { transaction }: { transaction: Transaction },
  ) => {
    const ids = inputs.map(({ id }) => id).filter(Boolean) as string[];

    await CategoryPortionSizeMethod.destroy({
      where: { categoryId, id: { [Op.notIn]: ids } },
      transaction,
    });

    if (!inputs.length)
      return [];

    const newMethods: CategoryPortionSizeMethod[] = [];

    for (const input of inputs) {
      const { id, ...rest } = input;

      if (id) {
        const match = methods.find(method => method.id === id);
        if (match) {
          await match.update(rest, { transaction });
          continue;
        }
      }

      const newMethod = await CategoryPortionSizeMethod.create(
        { ...rest, categoryId },
        { transaction },
      );
      newMethods.push(newMethod);
    }

    return [...methods, ...newMethods];
  };

  const createCategory = async (localeCode: string, input: CategoryInput) => {
    const category = await db.foods.transaction(async (transaction) => {
      const category = await Category.create(
        {
          code: input.code,
          localeId: localeCode,
          englishName: input.englishName,
          name: input.name,
          simpleName: toSimpleName(input.name)!,
          hidden: input.hidden,
          version: randomUUID(),
        },
        { transaction },
      );

      if (input.parentCategories?.length) {
        const categories = input.parentCategories.map(({ id }) => id);
        await category.$set('parentCategories', categories, { transaction });
      }

      return category;
    });

    return (await getCategory(category.id, localeCode))!;
  };

  const updateCategory = async (
    localeCode: string,
    categoryId: string,
    input: CategoryInput,
  ) => {
    const category = await getCategory(categoryId, localeCode);
    if (!category)
      throw new NotFoundError();

    const { portionSizeMethods } = category;
    if (!portionSizeMethods)
      throw new NotFoundError();

    await db.foods.transaction(async (transaction) => {
      const promises: Promise<any>[] = [
        category.update({
          ...pick(input, ['code', 'englishName', 'name', 'simpleName', 'hidden', 'tags', 'excludeTags']),
          simpleName: toSimpleName(input.name)!,
          version: randomUUID(),
        }, { transaction }),
        updatePortionSizeMethods(categoryId, portionSizeMethods, input.portionSizeMethods, { transaction }),
      ];

      if (input.parentCategories) {
        const categories = (input.parentCategories).map(({ id }) => id);
        promises.push(category.$set('parentCategories', categories, { transaction }));
      }

      await Promise.all(promises);
    });

    await cache.forget([
      `category-all-categories:${categoryId}`,
      `category-all-category-codes:${category.localeId}:${category.id}`,
      `category-parent-categories:${categoryId}`,
    ]);

    return (await getCategory(categoryId, localeCode))!;
  };

  const copyCategory = async (
    localeCode: string,
    categoryId: string,
    input: CategoryCopyInput,
  ) => {
    const sourceCategory = await getCategory(categoryId, localeCode);
    if (!sourceCategory)
      throw new NotFoundError();

    const category = await db.foods.transaction(async (transaction) => {
      const category = await Category.create(
        {
          ...pick(sourceCategory, ['code', 'localeId', 'englishName', 'name', 'simpleName', 'hidden', 'tags', 'excludeTags']),
          ...input,
          simpleName: toSimpleName(input.name)!,
          version: randomUUID(),
        },
        { transaction },
      );

      const promises: Promise<any>[] = [];

      if (sourceCategory?.parentCategories?.length) {
        const categories = sourceCategory.parentCategories.map(({ id }) => id);
        promises.push(category.$set('parentCategories', categories, { transaction }));
      }

      if (sourceCategory.portionSizeMethods?.length) {
        promises.push(
          ...sourceCategory.portionSizeMethods.map(psm =>
            CategoryPortionSizeMethod.create(
              {
                ...pick(psm, [
                  'method',
                  'description',
                  'useForRecipes',
                  'conversionFactor',
                  'orderBy',
                  'parameters',
                ]),
                categoryId: category.id,
              },
              { transaction },
            ),
          ),
        );
      }

      await Promise.all(promises);

      return category;
    });

    return (await getCategory(category.id, localeCode))!;
  };

  return {
    browseCategories,
    browseMainCategories,
    copyCategory,
    createCategory,
    getRootCategories,
    getNoCategoryContents,
    getCategoryContents,
    getCategory,
    updateCategory,
  };
}

export default adminCategoryService;

export type AdminCategoryService = ReturnType<typeof adminCategoryService>;
