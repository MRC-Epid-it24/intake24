import type { RecipeFoodTuple } from '../phrase-index';
import type { AlternativeFoodNames } from '@intake24/db';

import { CategoryLocal, FoodLocalList, RecipeFood } from '@intake24/db';

export type LocalFoodData = {
  code: string;
  name: string;
  altNames: AlternativeFoodNames;
  parentCategories: Set<string>;
};

export type LocalCategoryData = {
  code: string;
  name: string;
  isHidden: boolean;
  parentCategories: Set<string>;
};

// FIXME: all below requests should be limited to a constant amount of rows (paginated)

export async function fetchLocalFoods(localeId: string): Promise<LocalFoodData[]> {
  const localFoods = await FoodLocalList.findAll({
    attributes: ['foodCode'],
    where: { localeId },
    include: [{
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
    }],
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

export async function fetchLocalCategories(localeId: string): Promise<LocalCategoryData[]> {
  const localCategories = await CategoryLocal.findAll({
    where: { localeId },
    attributes: ['categoryCode', 'name'],
    include: [
      {
        required: true,
        association: 'main',
        attributes: ['code', 'isHidden'],
        include: [
          {
            association: 'parentCategories',
            attributes: ['code'],
          },
        ],
      },
    ],
  });

  return localCategories.map((row) => {
    const parentCategories = new Set(row.main!.parentCategories!.map(row => row.code));

    return ({
      code: row.categoryCode,
      name: row.name,
      isHidden: row.main!.isHidden,
      parentCategories,
    });
  });
}

/**
 * Build special foods list for a given locale
 * @param {string} localeId - food Locale
 * @returns {Promise<Map<string, RecipeFood>[]>} special foods list
 */
export async function fetchRecipeFoodsList(localeId: string): Promise<RecipeFoodTuple[]> {
  const recipeFoods = await RecipeFood.findAll({
    attributes: ['code', 'name', 'recipeWord'],
    where: { localeId },
    include: [{ association: 'synonymSet', attributes: ['synonyms'] }],
  });

  const recipeFoodsList: RecipeFoodTuple[] = [];
  recipeFoods.map((recipeFoodEntry: RecipeFood) =>
    recipeFoodsList.push([
      recipeFoodEntry.name.toLowerCase(),
      {
        code: recipeFoodEntry.code,
        name: recipeFoodEntry.name.toLowerCase(),
        recipeWord: recipeFoodEntry.recipeWord,
        synonyms: new Set<string>(
          recipeFoodEntry.recipeWord
            .concat(' ', recipeFoodEntry.synonymSet?.synonyms ?? '')
            .trim()
            .split(/\s+/),
        ),
        description: recipeFoodEntry.name.toLocaleLowerCase(),
      },
    ]),
  );
  return recipeFoodsList;
}
