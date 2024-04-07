import type { CategoryHeader } from '@intake24/common/types/http';
import type { AlternativeFoodNames } from '@intake24/db';
import { Category, CategoryLocal, FoodLocalList, RecipeFoods, SynonymSet } from '@intake24/db';

import type { RecipeFoodTuple } from '../phrase-index';

export type LocalFoodData = {
  code: string;
  name: string;
  altNames: AlternativeFoodNames;
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

  const entries: [string, GlobalCategoryEntry][] = categories.map(row => [
    row.code,
    {
      isHidden: row.isHidden,
      parentCategories: new Set(row.parentCategories!.map(row2 => row2.code)),
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
      attributes: ['name', 'altNames'],
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
    const parentCategories = new Set(row.foodLocal!.main!.parentCategories!.map(row => row.code));
    return {
      code: row.foodCode,
      name: row.foodLocal!.name,
      altNames: row.foodLocal!.altNames,
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

  return localCategories.map(row => ({
    code: row.categoryCode,
    name: row.name,
  }));
}

/**
 * Build special foods list for a given locale
 * @param {string} localeId - food Locale
 * @returns {Promise<Map<string, RecipeFood>[]>} special foods list
 */
export async function fetchRecipeFoodsList(localeId: string): Promise<RecipeFoodTuple[]> {
  const recipeFoods = await RecipeFoods.findAll({
    attributes: ['code', 'name', 'recipeWord'],
    where: { localeId },
    include: [{ model: SynonymSet, attributes: ['synonyms'] }],
  });

  const recipeFoodsList: RecipeFoodTuple[] = [];
  recipeFoods.map((recipeFoodEntry: RecipeFoods) =>
    recipeFoodsList.push([
      recipeFoodEntry.name.toLowerCase(),
      {
        code: recipeFoodEntry.code,
        name: recipeFoodEntry.name.toLowerCase(),
        recipeWord: recipeFoodEntry.recipeWord,
        synonyms: new Set<string>(
          recipeFoodEntry.recipeWord
            .concat(' ', recipeFoodEntry.synonyms?.synonyms ?? '')
            .trim()
            .split(/\s+/),
        ),
        description: recipeFoodEntry.name.toLocaleLowerCase(),
      },
    ]),
  );
  return recipeFoodsList;
}
