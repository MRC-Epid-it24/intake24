import type csvParser from 'csv-parser';
import { randomUUID } from 'node:crypto';

import { createReadStream } from 'node:fs';
import parseCsv from 'csv-parser';
import { groupBy, mapValues } from 'lodash';
import removeBOM from 'remove-bom-stream';
import { logger as mainLogger } from '@intake24/common-backend/services/logger';
import { Dictionary } from '@intake24/common/types';
import { PackageWriter } from '../packager/package-writer';
import { PkgGlobalFood, PkgLocalFood } from '../packager/types/foods';
import { PkgLocale } from '../packager/types/locale';

export interface GoustoLocaleOptions {
  sourcePath: string;
  outputPath: string;
}

interface GoustoRecipeRow {
  menuWeekSelected: string;
  goustoRecipeId: string;
  recipeTitle: string;
  primaryProteinSource: string;
  ingredientCode: string;
  ingredientQuantityInMealFor1: string;
  ingredientQuantityInMealFor2: string;
  ingredientQuantityInMealFor3: string;
  ingredientQuantityInMealFor4: string;
  ingredientQuantityInMealFor5: string;
  description: string;
  netProductWeightGrams: string;
  netProductWeightGramsPerPortion: string;
  menuWeeksAvailable: string;
  lastMenuWeekAvailable: string;
  quantity: string;
  approved: string;
  precollString: string;
}

interface GoustoRecipeData {
  recipeTitle: string;
  primaryProteinSource: string;
}

const locale: PkgLocale = {
  id: 'UK_Gousto',
  localName: 'UK with Gousto recipe boxes',
  englishName: 'UK with Gousto recipe boxes',
  textDirection: 'ltr',
  prototypeLocale: null,
  respondentLanguage: 'en',
  flagCode: 'gb',
  adminLanguage: 'en',
  foodIndexLanguageBackendId: 'en',
};

async function readCSV(
  path: string,
  onRowData: (data: any) => void,
  optionsOrHeaders?: csvParser.Options | ReadonlyArray<string>,
): Promise<void> {
  return new Promise((resolve) => {
    createReadStream(path)
      .pipe(removeBOM())
      .pipe(parseCsv(optionsOrHeaders))
      .on('data', (data: any) => {
        onRowData(data);
      })
      .on('end', () => {
        resolve();
      });
  });
}

async function readRecipeDropCSV(path: string): Promise<GoustoRecipeRow[]> {
  const rows: GoustoRecipeRow[] = [];

  await readCSV(
    path,
    (data) => {
      if (data.goustoRecipeId)
        rows.push(data);
    },
    {
      headers: [
        'menuWeekSelected',
        'goustoRecipeId',
        'recipeTitle',
        'primaryProteinSource',
        'ingredientCode',
        'ingredientQuantityInMealFor1',
        'ingredientQuantityInMealFor2',
        'ingredientQuantityInMealFor3',
        'ingredientQuantityInMealFor4',
        'ingredientQuantityInMealFor5',
        'description',
        'netProductWeightGrams',
        'netProductWeightGramsPerPortion',
        'menuWeeksAvailable',
        'lastMenuWeekAvailable',
        'quantity',
        'approved',
        'precollString',
      ],
      skipLines: 1,
    },
  );

  return rows;
}

function buildRecipeData(rows: GoustoRecipeRow[]): Dictionary<GoustoRecipeData> {
  function buildSingleRecipeData(singleRecipeRows: GoustoRecipeRow[]): GoustoRecipeData {
    return {
      recipeTitle: singleRecipeRows[0].recipeTitle,
      primaryProteinSource: singleRecipeRows[0].primaryProteinSource,
    };
  }

  return mapValues(
    groupBy(rows, row => row.goustoRecipeId),
    rows => buildSingleRecipeData(rows),
  );
}

function codeTransform(recipeId: string): string {
  return `G${recipeId.replace('-', '')}`;
}

function buildLocalFoods(recipeData: Dictionary<GoustoRecipeData>): PkgLocalFood[] {
  function buildLocalFood(recipeId: string, recipeData: GoustoRecipeData): PkgLocalFood {
    return {
      code: codeTransform(recipeId),
      associatedFoods: [],
      brandNames: [],
      nutrientTableCodes: {},
      portionSize: [],
      alternativeNames: {},
      localDescription: recipeData.recipeTitle,
      tags: ['gousto-recipe'],
    };
  }

  return Object.entries(recipeData).map(([recipeId, recipeData]) => buildLocalFood(recipeId, recipeData));
}

function buildGlobalFoods(recipeData: Dictionary<GoustoRecipeData>): PkgGlobalFood[] {
  function buildGlobalFood(recipeId: string, recipeData: GoustoRecipeData): PkgGlobalFood {
    return {
      code: codeTransform(recipeId),
      attributes: {},
      englishDescription: recipeData.recipeTitle,
      groupCode: 1,
      parentCategories: [],
      version: randomUUID(),
    };
  }

  return Object.entries(recipeData).map(([recipeId, recipeData]) => buildGlobalFood(recipeId, recipeData));
}

export default async (options: GoustoLocaleOptions): Promise<void> => {
  const logger = mainLogger.child({ service: 'Gousto locale build' });

  logger.info('Reading recipe file');

  const recipeRows = await readRecipeDropCSV(options.sourcePath);

  const recipeData = buildRecipeData(recipeRows);

  const globalFoods = buildGlobalFoods(recipeData);

  const localFoods = buildLocalFoods(recipeData);

  const writer = new PackageWriter(logger, options.outputPath);

  await Promise.all([
    writer.writeLocales([locale]),
    writer.writeLocalFoods(
      {
        [locale.id]: localFoods,
      },
    ),
    writer.writeGlobalFoods(
      globalFoods,
    ),
    writer.writeEnabledLocalFoods(
      {
        [locale.id]: globalFoods.map(f => f.code),
      },
    ),
    writer.writePackageInfo(),
  ]);
};
