import { createReadStream } from 'node:fs';

import parseCsv from 'csv-parser';
import fs from 'fs/promises';
import { groupBy } from 'lodash';
import path from 'path';
import stripBomStream from 'strip-bom-stream';
import { v4 as randomUUID } from 'uuid';

import type { FrenchLocaleOptions } from '@intake24/cli/commands/fr-inca3/build-fr-locale-command';
import type { INCA3EnglishDescription } from '@intake24/cli/commands/fr-inca3/types/english-description';
import type { INCA3FoodListRow } from '@intake24/cli/commands/fr-inca3/types/food-list';
import type { INCA3FoodQuantRow } from '@intake24/cli/commands/fr-inca3/types/food-quant';
import type { INCA3FoodShadowsRow } from '@intake24/cli/commands/fr-inca3/types/food-shadows';
import type { INCA3FoodStandardUnitRow } from '@intake24/cli/commands/fr-inca3/types/food-standard-portions';
import type { INCA3PortionSizeImage } from '@intake24/cli/commands/fr-inca3/types/portion-size-images';
import type { INCA3RecipeListRow } from '@intake24/cli/commands/fr-inca3/types/recipe-list';
import type { INCA3RecipeQuantRow } from '@intake24/cli/commands/fr-inca3/types/recipe-quant';
import type { INCA3RecipeShadowsRow } from '@intake24/cli/commands/fr-inca3/types/recipe-shadows';
import type { INCA3RecipeStandardUnitRow } from '@intake24/cli/commands/fr-inca3/types/recipe-standard-portions';
import type { PkgAsServedSet } from '@intake24/cli/commands/packager/types/as-served';
import type {
  PkgGlobalCategory,
  PkgLocalCategory,
} from '@intake24/cli/commands/packager/types/categories';
import type {
  PkgGlobalFood,
  PkgLocalFood,
  PkgPortionSizeMethod,
  PkgStandardUnit,
} from '@intake24/cli/commands/packager/types/foods';
import type { PkgLocale } from '@intake24/cli/commands/packager/types/locale';
import type { PkgNutrientTable } from '@intake24/cli/commands/packager/types/nutrient-tables';
import { PackageWriter } from '@intake24/cli/commands/packager/package-writer';
import { capitalize } from '@intake24/common/util';
import logger from '@intake24/common-backend/services/logger/logger';

export type Logger = typeof logger;

const locale: PkgLocale = {
  id: 'fr_ANSES',
  localName: 'France (ANSES)',
  englishName: 'France (ANSES)',
  textDirection: 'ltr',
  prototypeLocale: null,
  respondentLanguage: 'fr',
  flagCode: 'fr',
  adminLanguage: 'fr',
};

const dummyNutrientTable: PkgNutrientTable = {
  id: 'FR_TEMP',
  description: 'Placeholder nutrient table',
  csvFieldMapping: [],
  csvNutrientMapping: [],
  csvMapping: {
    idColumnOffset: 0,
    descriptionColumnOffset: 1,
    localDescriptionColumnOffset: 2,
    rowOffset: 1,
  },
  records: [
    {
      name: 'Placeholder record 1',
      recordId: 'FRPH1',
      nutrients: [['1', 100]], // Energy Kcal
      fields: [],
    },
  ],
};

function isFoodCode(code: string): boolean {
  return !code.includes('-');
}

function getIntake24FoodCode(foodCode: string): string {
  return `23FR${foodCode}`;
}

function getIntake24RecipeCode(foodCode: string): string {
  return `23FRR${foodCode}`;
}

export class FrenchAnsesLocaleBuilder {
  private readonly sourceDirPath: string;
  private readonly outputDirPath: string;
  private readonly logger: Logger;

  private sourceRecords: INCA3FoodListRow[] | undefined;
  private sourceFoodRecords: INCA3FoodListRow[] | undefined;
  private foodPortionSizeRecords: Record<string, INCA3FoodQuantRow> | undefined;
  private foodEnglishDescriptions: Record<string, string> | undefined;
  private foodSynonyms: Record<string, string[]> | undefined;
  private foodStandardUnits: Record<string, INCA3FoodStandardUnitRow[]> | undefined;
  private foodCategories: Record<string, string[]> | undefined;

  private sourceRecipeRecords: INCA3RecipeListRow[] | undefined;
  private recipeEnglishDescriptions: Record<string, string> | undefined;
  private recipePortionSizeRecords: Record<string, INCA3RecipeQuantRow> | undefined;
  private recipeSynonyms: Record<string, string[]> | undefined;
  private recipeStandardUnits: Record<string, INCA3RecipeStandardUnitRow[]> | undefined;
  private recipeCategories: Record<string, string[]> | undefined;

  private categoryNames: Record<string, string> | undefined;

  private portionSizeImages: INCA3PortionSizeImage[] | undefined;

  constructor(logger: Logger, options: FrenchLocaleOptions) {
    this.sourceDirPath = options.inputPath;
    this.outputDirPath = options.outputPath;
    this.logger = logger;
  }

  private async readJSON<T>(relativePath: string): Promise<T> {
    const filePath = path.join(this.sourceDirPath, relativePath);
    return JSON.parse(await fs.readFile(filePath, 'utf-8')) as T;
  }

  // eslint-disable @typescript-eslint/no-unused-vars
  private getIntake24Categories(
    gpe: string,
    sgpe: string | undefined,
    ssgpe: string | undefined
  ): string[] {
    return [];
  }

  // eslint-disable @typescript-eslint/no-unused-vars
  private getRecipeIntake24Categories(
    gpe: string,
    sgpe: string | undefined,
    ssgpe: string | undefined
  ): string[] {
    return [];
  }

  private getFoodEnglishDescription(code: string): string {
    const description = this.foodEnglishDescriptions![code];

    if (description === undefined) {
      throw new Error(`Missing English description for food ${code}`);
    }

    return description;
  }

  private getRecipeEnglishDescription(code: string): string {
    const description = this.recipeEnglishDescriptions![code];

    if (description === undefined) {
      throw new Error(`Missing English description for recipe ${code}`);
    }

    return description;
  }

  private async readFoodCategories(): Promise<void> {
    const result: Record<string, string[]> = {};

    return new Promise((resolve) => {
      createReadStream(path.join(this.sourceDirPath, 'categories', 'foods.csv'))
        .pipe(stripBomStream())
        .pipe(parseCsv({ headers: false, skipLines: 1 }))
        .on('data', (data) => {
          const a_code = data[6];

          if (a_code) {
            const cat1 = data[9];
            const cat2 = data[11];
            const cat3 = data[13];

            const list = result[a_code] ?? [];

            if (cat1) list.push(cat1);
            if (cat2) list.push(cat2);
            if (cat3) list.push(cat3);

            result[a_code] = list;
          }
        })
        .on('end', () => {
          this.foodCategories = result;
          resolve();
        });
    });
  }

  private async readRecipeCategories(): Promise<void> {
    const result: Record<string, string[]> = {};

    return new Promise((resolve) => {
      createReadStream(path.join(this.sourceDirPath, 'categories', 'recipes.csv'))
        .pipe(stripBomStream())
        .pipe(parseCsv({ headers: false, skipLines: 1 }))
        .on('data', (data) => {
          const r_code = data[3];

          if (r_code) {
            const cat1 = data[5];
            const cat2 = data[7];
            const cat3 = data[9];

            const list = result[r_code] ?? [];

            if (cat1) list.push(cat1);
            if (cat2) list.push(cat2);
            if (cat3) list.push(cat3);

            result[r_code] = list;
          }
        })
        .on('end', () => {
          this.recipeCategories = result;
          resolve();
        });
    });
  }

  private async readFoodList(): Promise<void> {
    function getSynonyms(row: any, prefix: string): string[] {
      const synonyms: string[] = [];
      for (let i = 1; i <= 8; i++) {
        const synonymValue = row[`${prefix}SYNONYME${i}`];
        if (synonymValue !== undefined) {
          synonyms.push(capitalize(synonymValue));
        }
      }
      return synonyms;
    }

    this.sourceRecords = await this.readJSON<INCA3FoodListRow[]>('ALIMENTS_FDLIST.json');
    this.sourceFoodRecords = this.sourceRecords.filter((record) => isFoodCode(record.A_CODE));

    const englishDescriptionRecords =
      await this.readJSON<INCA3EnglishDescription[]>('EN_DESC.json');

    const foodSynonymRecords = await this.readJSON<INCA3FoodShadowsRow[]>('ALIMENTS_SHADOWS.json');

    this.foodSynonyms = Object.fromEntries(
      foodSynonymRecords.map((r) => [r.A_CODE, getSynonyms(r, 'A_')]).filter((a) => a[1].length > 0)
    );

    this.foodEnglishDescriptions = Object.fromEntries(
      englishDescriptionRecords.map((r) => [r.code, r.englishDescription])
    );

    this.sourceRecipeRecords = await this.readJSON<INCA3RecipeListRow[]>('RECETTES_RCPLIST.json');

    const recipeDescriptionsRecords =
      await this.readJSON<INCA3EnglishDescription[]>('EN_DESC_RCP.json');

    const recipeSynonymRecords =
      await this.readJSON<INCA3RecipeShadowsRow[]>('RECETTES_SHADOWS.json');

    this.recipeSynonyms = Object.fromEntries(
      recipeSynonymRecords
        .map((r) => [r.R_CODE, getSynonyms(r, 'R_')])
        .filter((a) => a[1].length > 0)
    );

    this.recipeEnglishDescriptions = Object.fromEntries(
      recipeDescriptionsRecords.map((r) => [r.code, r.englishDescription])
    );
  }

  private async readCategoryNames(): Promise<void> {
    const result: Record<string, string> = {};

    return new Promise((resolve) => {
      createReadStream(path.join(this.sourceDirPath, 'categories', 'names.csv'))
        .pipe(stripBomStream())
        .pipe(parseCsv({ headers: false, skipLines: 0 }))
        .on('data', (data) => {
          result[data[0]] = data[1];
        })
        .on('end', () => {
          this.categoryNames = result;
          resolve();
        });
    });
  }

  private async readQuantificationData(): Promise<void> {
    const fdQuantRows = await this.readJSON<INCA3FoodQuantRow[]>('ALIMENTS_FDQUANT.json');

    this.foodPortionSizeRecords = Object.fromEntries(fdQuantRows.map((row) => [row.A_CODE, row]));

    const rcpQuantRows = await this.readJSON<INCA3RecipeQuantRow[]>('RECETTES_RCPQUANT.json');

    this.recipePortionSizeRecords = Object.fromEntries(
      rcpQuantRows.map((row) => [row.R_CODE, row])
    );
  }

  private async readPortionSizeImages(): Promise<void> {
    this.portionSizeImages = await this.readJSON<INCA3PortionSizeImage[]>(
      path.join('portion-size', 'images.json')
    );
  }

  private async readFoodStandardUnits(): Promise<void> {
    const rows = await this.readJSON<INCA3FoodStandardUnitRow[]>('ALIMENTS_FDSTD.json');
    this.foodStandardUnits = groupBy(rows, (row) => row.A_CODE);
  }

  private async readRecipeStandardUnits(): Promise<void> {
    const rows = await this.readJSON<INCA3RecipeStandardUnitRow[]>('RECETTES_RCPSTD.json');
    this.recipeStandardUnits = groupBy(rows, (row) => row.R_CODE);
  }

  private buildGlobalFoods(): PkgGlobalFood[] {
    const globalFoods: PkgGlobalFood[] = [];

    for (const row of this.sourceFoodRecords!) {
      const categories = this.foodCategories![row.A_CODE];

      if (!categories) console.warn(`Food ${row.A_CODE} is not assigned to any categories`);

      globalFoods.push({
        version: randomUUID(),
        code: getIntake24FoodCode(row.A_CODE),
        parentCategories: categories ?? [],
        attributes: { readyMealOption: true },
        groupCode: 1,
        englishDescription: capitalize(this.getFoodEnglishDescription(row.A_CODE)),
      });
    }

    for (const row of this.sourceRecipeRecords!) {
      const categories = this.recipeCategories![row.R_CODE];

      if (!categories) console.warn(`Recipe ${row.R_CODE} is not assigned to any categories`);

      globalFoods.push({
        version: randomUUID(),
        code: getIntake24RecipeCode(row.R_CODE),
        parentCategories: categories ?? [],
        attributes: {},
        groupCode: 1,
        englishDescription: capitalize(this.getRecipeEnglishDescription(row.R_CODE)),
      });
    }

    return globalFoods;
  }

  private photoListToAsServed(photoList: string): PkgPortionSizeMethod[] {
    const portionSizeMethods: PkgPortionSizeMethod[] = [];

    photoList
      .trim()
      .split(',')
      .forEach((pictureId) => {
        portionSizeMethods.push({
          method: 'as-served',
          description: 'use_an_image',
          useForRecipes: true,
          conversionFactor: 1.0,
          servingImageSet: `INCA3_${pictureId.padStart(3, '0')}`,
        });
      });

    return portionSizeMethods;
  }

  private getFoodPortionSizeMethods(foodCode: string): PkgPortionSizeMethod[] {
    if (this.foodPortionSizeRecords === undefined) {
      throw new Error('Portion size data not loaded');
    }

    const portionSizeMethods: PkgPortionSizeMethod[] = [];

    const portionSizeRow = this.foodPortionSizeRecords[foodCode];

    if (portionSizeRow !== undefined) {
      if (
        portionSizeRow.LISTE_PHOTOS !== undefined &&
        portionSizeRow.LISTE_PHOTOS.length > 0 &&
        portionSizeRow.LISTE_PHOTOS !== '.'
      ) {
        portionSizeMethods.push(...this.photoListToAsServed(portionSizeRow.LISTE_PHOTOS));
      }

      if (
        portionSizeRow.METHODE_unite_standard !== undefined &&
        portionSizeRow.METHODE_unite_standard !== '.'
      ) {
        const standardUnitRows = this.foodStandardUnits![foodCode];

        if (standardUnitRows !== undefined) {
          const units: PkgStandardUnit[] = standardUnitRows.map((row) => {
            const description = row.A_US_LIBELLE.replace(/^1\s+/, '');

            if (row.A_US_UNITE !== 'G' && row.A_US_UNITE !== 'V') {
              logger.warn(
                `Unexpected weight unit for a standard unit option: "${row.A_US_UNITE}", for food id ${foodCode}, standard unit number ${row.A_US_NUM} `
              );
            }

            return {
              name: `INCA3_${foodCode}_${row.A_US_NUM}`,
              weight: row.A_US_POIDS,
              omitFoodDescription: true,
              inlineEstimateIn: description,
              inlineHowMany: `Combien de ${description}`,
            };
          });

          portionSizeMethods.push({
            method: 'standard-portion',
            description: 'use_a_standard_portion',
            useForRecipes: true,
            conversionFactor: 1,
            units,
          });
        } else {
          logger.warn(`Food ${foodCode} has no corresponding record in the ALIMENTS_FDSTD table`);
        }
      }
    } else {
      logger.warn(`Food ${foodCode} has no corresponding record in the ALIMENTS_FDQUANT table`);
    }

    if (portionSizeMethods.length === 0) {
      // Temporary fallback method, shouldn't be there in the final version

      portionSizeMethods.push({
        method: 'standard-portion',
        description: 'use_a_standard_portion',
        useForRecipes: true,
        conversionFactor: 1.0,
        units: [
          {
            name: 'pieces',
            omitFoodDescription: false,
            weight: 100,
          },
        ],
      });
    }

    return portionSizeMethods;
  }

  private getRecipePortionSizeMethods(recipeCode: string): PkgPortionSizeMethod[] {
    if (this.recipePortionSizeRecords === undefined) {
      throw new Error('Recipe portion size data not loaded');
    }

    const portionSizeMethods: PkgPortionSizeMethod[] = [];

    const portionSizeRow = this.recipePortionSizeRecords[recipeCode];

    if (portionSizeRow !== undefined) {
      if (
        portionSizeRow.LISTE_PHOTOS !== undefined &&
        portionSizeRow.LISTE_PHOTOS.length > 0 &&
        portionSizeRow.LISTE_PHOTOS !== '.'
      ) {
        portionSizeMethods.push(...this.photoListToAsServed(portionSizeRow.LISTE_PHOTOS));
      }

      if (
        portionSizeRow.METHODE_unite_standard !== undefined &&
        portionSizeRow.METHODE_unite_standard !== '.'
      ) {
        const standardUnitRows = this.recipeStandardUnits![recipeCode];

        if (standardUnitRows !== undefined) {
          const units: PkgStandardUnit[] = standardUnitRows.map((row) => {
            const description = row.R_US_LIBELLE.replace(/^1\s+/, '');

            return {
              name: `INCA3_R${recipeCode}_${row.R_US_NUM}`,
              weight: row.R_US_POIDS,
              omitFoodDescription: true,
              inlineEstimateIn: description,
              inlineHowMany: `Combien de ${description}`,
            };
          });

          portionSizeMethods.push({
            method: 'standard-portion',
            description: 'use_a_standard_portion',
            useForRecipes: true,
            conversionFactor: 1,
            units,
          });
        } else {
          logger.warn(
            `Recipe ${recipeCode} has no corresponding record in the RECETTES_RCPSTD table`
          );
        }
      }
    } else {
      logger.warn(
        `Recipe ${recipeCode} has no corresponding record in the RECETTES_RCPQUANT table`
      );
    }

    if (portionSizeMethods.length === 0) {
      // Temporary fallback method, shouldn't be there in the final version

      portionSizeMethods.push({
        method: 'standard-portion',
        description: 'use_a_standard_portion',
        useForRecipes: true,
        conversionFactor: 1.0,
        units: [
          {
            name: 'pieces',
            omitFoodDescription: false,
            weight: 100,
          },
        ],
      });
    }

    return portionSizeMethods;
  }

  private buildLocalFoods(): PkgLocalFood[] {
    const localFoods: PkgLocalFood[] = [];

    for (const row of this.sourceFoodRecords!) {
      const foodSynonyms = this.foodSynonyms![row.A_CODE];
      const alternativeNames = foodSynonyms === undefined ? undefined : { fr: foodSynonyms };

      localFoods.push({
        version: randomUUID(),
        code: getIntake24FoodCode(row.A_CODE),
        localDescription: capitalize(row.A_LIBELLE),
        alternativeNames,
        nutrientTableCodes: {
          FR_TEMP: 'FRPH1',
        },
        associatedFoods: [],
        portionSize: this.getFoodPortionSizeMethods(row.A_CODE),
        brandNames: [],
      });
    }

    for (const row of this.sourceRecipeRecords!) {
      const recipeSynonyms = this.recipeSynonyms![row.R_CODE];
      const alternativeNames = recipeSynonyms === undefined ? undefined : { fr: recipeSynonyms };

      localFoods.push({
        version: randomUUID(),
        code: getIntake24RecipeCode(row.R_CODE),
        localDescription: capitalize(row.R_LIBELLE),
        alternativeNames,
        nutrientTableCodes: {
          FR_TEMP: 'FRPH1',
        },
        associatedFoods: [],
        portionSize: this.getRecipePortionSizeMethods(row.R_CODE),
        brandNames: [],
      });
    }

    return localFoods;
  }

  private buildGlobalCategories(): PkgGlobalCategory[] {
    return [
      {
        code: 'FRPEPO',
        attributes: {},
        englishDescription: 'Baby food and savoury snacks',
        parentCategories: ['19TODSFD'],
        version: '0fd3f027-6f2a-47f3-9838-7bb0037a4fd4',
        isHidden: false,
      },
      {
        code: 'FRDEIN',
        attributes: {},
        englishDescription: 'Baby desserts',
        parentCategories: ['19TODSFD'],
        version: '64f6bd7b-0f0b-41b6-ab20-afac96078a28',
        isHidden: false,
      },
      {
        code: 'FRCEBI',
        attributes: {},
        englishDescription: 'Baby cereals and biscuits',
        parentCategories: ['19TODSFD'],
        version: '7e12b7a1-e7e3-4c57-9f2a-ddf5c1c05f3b',
        isHidden: false,
      },
      {
        code: 'FRLABO',
        attributes: {},
        englishDescription: 'Baby milk and drinks',
        parentCategories: ['19TODSFD'],
        version: '7e12b7a1-e7e3-4c57-9f2a-ddf5c1c05f3b',
        isHidden: false,
      },
      {
        code: 'FRLAMA',
        attributes: {},
        englishDescription: 'Breast milk',
        parentCategories: ['FRLBI'],
        version: 'e309274c-12be-49d0-88e2-26744ce7f3c1',
        isHidden: false,
      },
    ];
  }

  private buildLocalCategories(): PkgLocalCategory[] {
    const localCategories: PkgLocalCategory[] = [
      {
        code: 'FRPEPO',
        localDescription: 'Petits pots salés & plats infantiles',
        portionSize: [],
      },
      {
        code: 'FRDEIN',
        localDescription: 'Desserts infantiles',
        portionSize: [],
      },
      {
        code: 'FRCEBI',
        localDescription: 'Céréales & biscuits infantiles',
        portionSize: [],
      },
      {
        code: 'FRLABO',
        localDescription: 'Laits & boissons infantiles',
        portionSize: [],
      },
      {
        code: 'FRLAMA',
        localDescription: 'Lait maternel',
        portionSize: [],
      },
    ];

    for (const [code, localDescription] of Object.entries(this.categoryNames!)) {
      localCategories.push({
        code,
        localDescription,
        portionSize: [],
      });
    }

    return localCategories;
  }

  private buildAsServed(): PkgAsServedSet[] {
    const imagesById = groupBy(this.portionSizeImages, (record) => record.pictureId);

    return Object.entries(imagesById).map(([imageId, images]) => {
      return {
        id: `INCA3_${imageId}`,
        description: images[0].name,
        selectionImagePath: '',
        images: images.map((image) => ({
          imagePath: `INCA3/${image.fileName}`,
          weight: parseFloat(image.weight),
          imageKeywords: [],
        })),
      };
    });
  }

  public async buildPackage(): Promise<void> {
    await this.readFoodList();
    await this.readFoodCategories();
    await this.readRecipeCategories();
    await this.readCategoryNames();
    await this.readQuantificationData();
    await this.readPortionSizeImages();
    await this.readFoodStandardUnits();
    await this.readRecipeStandardUnits();

    const globalFoods = this.buildGlobalFoods();
    const localFoods = this.buildLocalFoods();

    const globalCategories = this.buildGlobalCategories();
    const localCategories = this.buildLocalCategories();

    const localFoodsRecord = {
      [locale.id]: localFoods,
    };

    const enabledLocalFoods = {
      [locale.id]: localFoods.map((f) => f.code),
    };

    const localCategoriesRecord = {
      [locale.id]: localCategories,
    };

    const asServedSets = this.buildAsServed();

    const writer = new PackageWriter(this.logger, this.outputDirPath);

    await writer.writeLocales([locale]);
    await writer.writeGlobalFoods(globalFoods);
    await writer.writeLocalFoods(localFoodsRecord);
    await writer.writeGlobalCategories(globalCategories);
    await writer.writeLocalCategories(localCategoriesRecord);
    await writer.writeEnabledLocalFoods(enabledLocalFoods);
    await writer.writeNutrientTables([dummyNutrientTable]);
    await writer.writeAsServedSets(asServedSets);
  }
}
