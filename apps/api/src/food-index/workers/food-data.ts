import type { CategoryHeader } from '@intake24/common/types/http';
import { Category, CategoryLocal, FoodLocalList } from '@intake24/db';

export type LocalFoodData = {
  code: string;
  name: string;
  parentCategories: Set<string>;
};

export type GlobalCategoryEntry = {
  isHidden: boolean;
  parentCategories: Set<string>;
};

export type GlobalCategoryData = Map<string, GlobalCategoryEntry>;

// FIXME: all below requests should be limited to a constant amount of rows (paginated)

export async function fetchGlobalCategoryData(): Promise<GlobalCategoryData> {
  const categories = await Category.findAll({
    attributes: ['code', 'isHidden'],
    include: {
      association: 'parentCategories',
      attributes: ['code'],
    },
  });

  const entries: [string, GlobalCategoryEntry][] = categories.map((row) => [
    row.code,
    {
      isHidden: row.isHidden,
      parentCategories: new Set(row.parentCategories!.map((row2) => row2.code)),
    },
  ]);

  return new Map(entries);
}

export async function fetchLocalFoods(localeId: string): Promise<LocalFoodData[]> {
  const localFoods = await FoodLocalList.findAll({
    attributes: ['foodCode'],
    where: { localeId },
    include: {
      required: true,
      association: 'foodLocal',
      attributes: ['name'],
      where: { localeId },
      include: [
        {
          required: true,
          association: 'main',
          attributes: ['code'],
          include: [
            {
              association: 'parentCategories',
              attributes: ['code'],
            },
          ],
        },
      ],
    },
  });

  return localFoods.map((row) => {
    const parentCategories = new Set(row.foodLocal!.main!.parentCategories!.map((row) => row.code));
    return {
      code: row.foodCode,
      name: row.foodLocal!.name,
      parentCategories,
    };
  });
}

export async function fetchLocalCategories(localeId: string): Promise<CategoryHeader[]> {
  const localCategories = await CategoryLocal.findAll({
    where: { localeId },
    attributes: ['categoryCode', 'name'],
    include: { required: true, association: 'main', attributes: [], where: { isHidden: false } },
  });

  return localCategories.map((row) => ({
    code: row.categoryCode,
    name: row.name,
  }));
}
