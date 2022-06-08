import { CategoryContents, CategoryHeader } from '@intake24/common/types/http';
import {
  Category,
  CategoryLocal,
  Food,
  FoodCategory,
  FoodLocal,
  FoodsLocale as Locale,
} from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';

const categoryContentsService = () => {
  function filterUndefined(
    headers: { code: string; description: string | undefined }[]
  ): { code: string; description: string }[] {
    return headers
      .filter((h) => h.description !== undefined)
      .map((h) => {
        return {
          code: h.code,
          description: h.description!,
        };
      });
  }

  return {
    async getLocaleInfo(localeId: string): Promise<Locale> {
      const locale = await Locale.findOne({
        where: { id: localeId },
        attributes: ['prototypeLocaleId'],
      });

      if (locale === null) {
        throw new NotFoundError(`Locale ${localeId} not found`);
      }

      return locale;
    },

    async getCategoryHeader(
      localeId: string,
      prototypeLocaleId: string | null,
      categoryCode: string
    ): Promise<CategoryHeader> {
      const category = await Category.findOne({
        where: { code: categoryCode },
        attributes: ['code'],
        include: [
          {
            model: CategoryLocal,
            as: 'locals',
            where: { localeId },
            required: false,
          },
          {
            model: CategoryLocal,
            as: 'prototypeLocals',
            where: { localeId: prototypeLocaleId },
            required: false,
          },
        ],
      });

      if (category === null) {
        throw new NotFoundError(`Category ${categoryCode} not found`);
      }

      return {
        code: categoryCode,
        description:
          category.locals?.[0].name ??
          category.prototypeLocals?.[0].name ??
          '# Description missing!',
      };
    },

    async getCategoryContents(localeId: string, categoryCode: string): Promise<CategoryContents> {
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

      const locale = await this.getLocaleInfo(localeId);

      const { prototypeLocaleId } = locale;

      const header = await this.getCategoryHeader(localeId, prototypeLocaleId, categoryCode);

      const category = await Category.findOne({
        where: { code: categoryCode },
        attributes: ['code'],
        include: [
          {
            model: Category,
            as: 'subCategories',
            required: true,
            attributes: ['code'],
            include: [
              {
                model: CategoryLocal,
                as: 'locals',
                where: { localeId },
                required: false,
              },
              {
                model: CategoryLocal,
                as: 'prototypeLocals',
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
            model: Food,
            required: true,
            include: [
              {
                model: Locale,
                attributes: [],
                where: { id: localeId },
                required: true,
              },
              {
                model: FoodLocal,
                as: 'locals',
                where: { localeId },
                required: false,
              },
              {
                model: FoodLocal,
                as: 'prototypeLocals',
                where: { localeId: prototypeLocaleId },
                required: false,
              },
            ],
          },
        ],
      });

      const foodHeaders = foods.map((row) => {
        const description = row.food?.locals?.[0].name ?? row.food?.prototypeLocals?.[0].name;

        return {
          code: row.foodCode,
          description,
        };
      });

      const categoryHeaders = (category?.subCategories ?? []).map((row) => {
        const description = row.locals?.[0].name ?? row.prototypeLocals?.[0].name;

        return {
          code: row.code,
          description,
        };
      });

      return {
        header,
        foods: filterUndefined(foodHeaders).sort((a, b) =>
          a.description.localeCompare(b.description)
        ),
        subcategories: filterUndefined(categoryHeaders).sort((a, b) =>
          a.description.localeCompare(b.description)
        ),
      };
    },
  };
};

export default categoryContentsService;

export type CategoryContentsService = ReturnType<typeof categoryContentsService>;
